import os
import pandas as pd
import numpy as np
import psycopg2
import uuid



courselist = []

connection = psycopg2.connect(
    host=os.getenv("DB_HOST"),      
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)

cursor = connection.cursor()


cursor.execute("DELETE FROM semester_courses")
cursor.execute("DELETE FROM semester")
cursor.execute("DELETE FROM studyplan")
cursor.execute("DELETE FROM studyprogram")
cursor.execute("DELETE FROM institute")
cursor.execute("DELETE FROM prerequisites")
cursor.execute("DELETE FROM course")

xls = pd.ExcelFile('static/Data.xlsx')
courses = pd.read_excel(xls, 'Emner 2018V-2028H')
UHCourses = pd.read_excel('static/DataMedEmnerFraTNSVUH.xlsx', 'Emner ved UH-fak 2018V-2028H')
SVCourses = pd.read_excel('static/DataMedEmnerFraTNSVUH.xlsx', 'Emner ved SV-fak 2018V-2028H')
utvalg = courses[['emnekode','emnenavn_bokmal','vektingstall','terminkode_und_forste','arstall_und_siste','terminkode_und_siste']].copy()
UHutvalg = UHCourses[['emnekode','emnenavn_bokmal','vektingstall','terminkode_und_forste','arstall_und_siste']].copy()
SVutvalg = SVCourses[['emnekode','emnenavn_bokmal','vektingstall','terminkode_und_forste','arstall_und_siste']].copy()

utvalg['terminkode_und_forste'] = utvalg['terminkode_und_forste'].str.replace('HØST','H')
utvalg['terminkode_und_forste'] = utvalg['terminkode_und_forste'].str.replace('VÅR','V')
utvalg = utvalg[~utvalg['terminkode_und_forste'].str.contains('SOM', case=True, na=False)]

UHutvalg['terminkode_und_forste'] = UHutvalg['terminkode_und_forste'].str.replace('HØST','H')
UHutvalg['terminkode_und_forste'] = UHutvalg['terminkode_und_forste'].str.replace('VÅR','V')
UHutvalg = UHutvalg[~UHutvalg['terminkode_und_forste'].str.contains('SOM', case=True, na=False)]

SVutvalg['terminkode_und_forste'] = SVutvalg['terminkode_und_forste'].str.replace('HØST','H')
SVutvalg['terminkode_und_forste'] = SVutvalg['terminkode_und_forste'].str.replace('VÅR','V')
SVutvalg = SVutvalg[~SVutvalg['terminkode_und_forste'].str.contains('SOM', case=True, na=False)]


for i in np.asarray(utvalg):
    course = [str(i[1])[:80],str(i[0])[:80],i[3],i[2]]
    print(course)
    group_id = str(uuid.uuid4())
    course.insert(2, group_id)
    if i[4] <= 2024 or i[4] == 2025 and i[5]=="VÅR":
        pass
    elif i[4] == 2025 and i[5]=="HØST":
        cursor.execute('INSERT INTO course (name, "courseCode",course_group_id,is_current,version, semester, credits, degree, is_active) VALUES (%s,%s,%s,True, 1, %s, %s, \'Bachelor\', False);', course)
        courselist.append(i[0])
    else:
        cursor.execute('INSERT INTO course (name, "courseCode",course_group_id,is_current,version, semester, credits, degree, is_active) VALUES (%s,%s,%s,True, 1, %s, %s, \'Bachelor\', True);', course)
        courselist.append(i[0])

for i in np.asarray(UHutvalg):
    course = [str(i[1])[:80],str(i[0])[:80],i[3],i[2]]
    group_id = str(uuid.uuid4())
    course.insert(2, group_id)
    if i[4] <= 2023:
        pass
    elif i[4] == 2024 or i[4] == 2025:
        cursor.execute('INSERT INTO course (name, "courseCode",course_group_id,is_current,version, semester, credits, degree, is_active) VALUES (%s,%s,%s,True, 1, %s, %s, \'Bachelor\', False);', course)
        courselist.append(i[0])
    else:
        cursor.execute('INSERT INTO course (name, "courseCode",course_group_id,is_current,version, semester, credits, degree, is_active) VALUES (%s,%s,%s,True, 1, %s, %s, \'Bachelor\', True);', course)
        courselist.append(i[0])

for i in np.asarray(SVutvalg):
    course = [str(i[1])[:80],str(i[0])[:80],i[3],i[2]]
    group_id = str(uuid.uuid4())
    course.insert(2, group_id)
    if i[4] <= 2023:
        pass
    elif i[4] == 2024 or i[4] == 2025:
        cursor.execute('INSERT INTO course (name, "courseCode",course_group_id,is_current,version, semester, credits, degree, is_active) VALUES (%s,%s,%s,True, 1, %s, %s, \'Bachelor\', False);', course)
        courselist.append(i[0])
    else:
        cursor.execute('INSERT INTO course (name, "courseCode",course_group_id,is_current,version, semester, credits, degree, is_active) VALUES (%s,%s,%s,True, 1, %s, %s, \'Bachelor\', True);', course)
        courselist.append(i[0])
        
for i in range(0, 30, 5):
    course = [
        "Valgemner " + str(i) + " Poeng",  
        "VALGEMNE" + str(i),              
        str(uuid.uuid4()),               
        "H",                              
        i                                 
    ]

    cursor.execute('''
        INSERT INTO course 
        (name, "courseCode", course_group_id, is_current, version, semester, credits, degree, is_active) 
        VALUES (%s, %s, %s, True, 1, %s, %s, 'Bachelor', True);
    ''', course)

connection.commit()

preReqs = pd.read_excel('static/cleaned_prerequisites.xlsx')
preReqs = preReqs[['emnekode','kravinnhold','arstall_til']]
activePreReqs = preReqs[preReqs['arstall_til'].isna()]

for i in np.asarray(activePreReqs):
    if i[0] in courselist and isinstance(i[1],str):
        preReqCode = i[1].split()
        cursor.execute('SELECT id FROM course WHERE "courseCode" = %s',(i[0],))
        course_ID = cursor.fetchone()
        cursor.execute('SELECT id FROM course WHERE "courseCode" = %s',(preReqCode[0],))
        preReq_ID = cursor.fetchone()
        if not course_ID or not preReq_ID:
            continue
        fetchedCourse = course_ID[0]
        fetchedPreReq = preReq_ID[0]
        cursor.execute("INSERT INTO prerequisites (course_id, prerequisite_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",(int(fetchedCourse),int(fetchedPreReq)))

connection.commit()
print("Courses seeded")

fix_dict = {}
institutes = pd.read_excel('static/Data.xlsx','Steder - Fakultet og institutt')
for x in institutes.values:
    if x[2] != 0:
        intitute_id = str(uuid.uuid4())
        fix_dict[x[2]] = intitute_id
        cursor.execute("INSERT INTO institute VALUES (%s, %s, %s)",(intitute_id,x[5],None)) 
print("Institutes seeded")

xls = pd.ExcelFile('static/Data.xlsx')
studyprograms = pd.read_excel(xls, 'Studieprogram')
utvalg = studyprograms[['studieprogramkode','studieprognavn','tall_varighet','instituttnr_studieansv','status_utgatt']]

codesToSkip = ["B-BYGG","B-ELE-YVEI","B-ELEKTRO","M-BIOENG","M-DATATEK-5","M-INDØKG","M-INDØKG5","M-LEKTREA","M-RISGOV","M-SAMSIK","M-ROBOT","M-MAFYS5"]

for i in np.asarray(utvalg):
    kode = i[0]
    navn = str(i[1])[:80]
    varighet = i[2]
    institutt_nr = i[3]
    status = i[4]

    if kode in codesToSkip:
        continue
    institute_id = fix_dict.get(institutt_nr)

    if institute_id is None:
        print(f"Fant ikke mapping for institutt {institutt_nr}, hopper over {kode}")
        continue

    program = [navn, str(kode)[:80], institute_id, varighet]

    if kode[0] == "B" and status == "N" and navn[-6:] != "deltid":
        cursor.execute(
            "INSERT INTO studyprogram (name, program_code, degree_type, institute_id, semester_number) VALUES (%s, %s, 'Bachelor', %s, %s);",
            program
        )

    elif kode[0] == "M" and status == "N" and kode[-1] != "5" and navn[-6:] != "deltid":
        cursor.execute(
            "INSERT INTO studyprogram (name, program_code, degree_type, institute_id, semester_number) VALUES (%s, %s, 'Master', %s, %s);",
            program
        )

print("Studyprograms seeded")


connection.commit()
connection.close()



