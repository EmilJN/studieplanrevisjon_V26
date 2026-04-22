from flask import Blueprint, jsonify, send_file
from io import BytesIO
from docx import Document
from docx.shared import Pt, Inches
from services import ServiceFactory

exportdocx_bp = Blueprint('exportdocx', __name__)


def calculate_year(studyplan_year, semester_number, term):
    return studyplan_year + (semester_number - 1) // 2 + (1 if term == "V" else 0)


def generate_studyplan_docx(studyprogram, studyplans, course_to_package):
    doc = Document()

    doc.add_heading(f"{studyprogram.name}", level=1)
    doc.add_paragraph(f"Institution: {studyprogram.institute.name}")
    doc.add_paragraph(f"Ansvarlig: {studyprogram.institute.ansvarlig}")
    doc.add_paragraph(f"Degree Type: {studyprogram.degree_type}")
    doc.add_paragraph("\n")

    first_studyplan = studyplans[0]
    start_year = first_studyplan['year']
    end_year = calculate_year(
        start_year,
        first_studyplan['semesters'][-1]['semester_number'],
        first_studyplan['semesters'][-1]['term']
    )

    doc.add_heading(f"Studieplanmatrise", level=2)
    doc.add_paragraph(f"Studieplan {start_year} - {end_year} for {studyprogram.name}")

    table = doc.add_table(rows=len(first_studyplan['semesters']) + 1, cols=4)
    table.style = 'Table Grid'

    header_cells = table.rows[0].cells
    header_cells[0].text = "Semester"
    header_cells[1].text = "10 sp"
    header_cells[2].text = "10 sp"
    header_cells[3].text = "10 sp"

    # ===== MATRISE =====
    for row_idx, semester in enumerate(first_studyplan['semesters'], start=1):
        row = table.rows[row_idx].cells
        semester_year = calculate_year(start_year, semester['semester_number'], semester['term'])

        row[0].text = f"{semester['semester_number']} ({semester['term']}-{semester_year})"

        blocks = ["", "", ""]
        current_block = 0
        current_block_credits = 0

        for course in semester['semester_courses']:
            if course['is_elective']:
                blocks = ["VALGEMNE", "VALGEMNE", "VALGEMNE"]
                break
            else:
                course_text = f"{course['courseCode']} ({course['credits']} sp)"
                course_credits = course['credits'] or 0

                if current_block_credits + course_credits <= 10:
                    blocks[current_block] += course_text + "\n"
                    current_block_credits += course_credits
                else:
                    current_block += 1
                    if current_block < 3:
                        blocks[current_block] += course_text + "\n"
                        current_block_credits = course_credits

        for col_idx in range(3):
            row[col_idx + 1].text = blocks[col_idx]

    doc.add_paragraph("\n")

    # ===== EMNEOVERSIKT MED PAKKER =====
    doc.add_heading("Emneoversikt", level=2)

    for semester in first_studyplan['semesters']:
        semester_year = calculate_year(start_year, semester['semester_number'], semester['term'])
        semester_heading = doc.add_heading(
            f"Semester {semester['semester_number']} ({semester['term']} {semester_year})",
            level=2
        )
        semester_heading.paragraph_format.space_before = Pt(12)
        semester_heading.paragraph_format.space_after = Pt(6)

        courses_by_package = {}

        for course in semester['semester_courses']:
            if course['is_elective']:
                continue

            course_id = course.get('id')
            pkg = course_to_package.get(course_id)

            pkg_name = pkg["name"] if pkg else "Faste emner"

            if pkg_name not in courses_by_package:
                courses_by_package[pkg_name] = []

            courses_by_package[pkg_name].append(course)

        sorted_packages = sorted(
            courses_by_package.items(),
            key=lambda x: (x[0] != "Faste emner", x[0])
        )

        for pkg_name, courses_in_pkg in sorted_packages:
            total_credits = sum(course.get("credits") or 0 for course in courses_in_pkg)

            pkg_para = doc.add_paragraph(f"{pkg_name} (sp: {total_credits})")
            pkg_para.style = "Heading 3"
            pkg_para.paragraph_format.left_indent = Inches(0.3)
            pkg_para.paragraph_format.space_before = Pt(6)
            pkg_para.paragraph_format.space_after = Pt(2)

            for course in courses_in_pkg:
                course_para = doc.add_paragraph(
                    f"{course['courseCode']} - {course['name']} ({course['credits']} sp)"
                )
                course_para.paragraph_format.left_indent = Inches(0.6)
                course_para.paragraph_format.space_after = Pt(1)

    return doc


# ===== ROUTE =====
@exportdocx_bp.route('/<int:studyprogram_id>', methods=['GET'])
def export_to_docx(studyprogram_id):
    try:
        studyplan_service = ServiceFactory.get_studyplan_service()
        studyprogram_service = ServiceFactory.get_studyprogram_service()
        coursepackage_service = ServiceFactory.get_coursepackage_service()

        studyprogram = studyprogram_service.get_studyprogram_by_id(studyprogram_id)

        if not studyprogram:
            return jsonify({"error": "Study program not found"}), 404

        studyplans = studyplan_service.get_plans_for_export(studyprogram_id)

        if not studyplans:
            return jsonify({"error": "No studyplans found"}), 400

        selected_plan = studyplans[0]
        selected_plan_id = selected_plan.get('id')

        if not selected_plan_id:
            print("WARNING: studyplan mangler id – hopper over pakker")
            packages = []
        else:
            packages = coursepackage_service.get_course_packages_by_studyplan(selected_plan_id)

        course_to_package = {}

        for pkg in packages:
            courses_in_pkg = coursepackage_service.get_courses_in_package(pkg.id)

            for course in courses_in_pkg:
                course_to_package[course.id] = {
                    "name": pkg.name,
                    "type": pkg.packagetype
                }

        doc = generate_studyplan_docx(studyprogram, studyplans, course_to_package)

        buffer = BytesIO()
        doc.save(buffer)
        buffer.seek(0)

        filename = f"studyplan_{studyprogram_id}_{studyplans[0]['year']}.docx"

        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500