import React, { useEffect, useState } from "react";
import {
    getElectiveGroups,
    createElectiveGroup,
    deleteElectiveGroup,
    updateElectiveGroup,
} from "../utils/categoryHelpers";


const ValgemneKategoriForm = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFetched, setIsFetched] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            if (isFetched) return;
            setLoading(true);
            try {
                const response = await getElectiveGroups();
                setCategories(response);
                setIsFetched(true);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setError("Failed to fetch categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [isFetched]);


    const handleAddCategory = async () => {
        if (categoryName.trim() === "") {
            setError("Category name cannot be empty");
            return;
        }
        if (categories.some((category) => category.name === categoryName)) {
            setError("Category name already exists");
            setCategoryName("");
            return;
        }
        try {
            const newCategory = await createElectiveGroup(categoryName);
            console.log("New category created:", newCategory);
            setCategories([...categories, newCategory]);
            setCategoryName("");
            setError(null);
        } catch (error) {
            setError("Failed to create category");
        }
    };

    const handleDeleteCategory = async (groupId) => {
        const categoryToDelete = categories.find((category) => category.id === groupId);
        if (!categoryToDelete) {
            setError("Category not found");
            return;
        }

        const confirmDelete = window.confirm(
            `Are you sure you want to delete the category "${categoryToDelete.name}"? This action cannot be undone.`
        )
        if (!confirmDelete) {
            return;
        }

        try {
            await deleteElectiveGroup(groupId);
            setCategories(categories.filter((category) => category.id !== groupId));
            setError(null);
        } catch (error) {

            const errorMessage = error.response?.data?.error || "Failed to delete 123category";
            setError(errorMessage);
        }
    };
    const handleEditCategory = (groupId, newName) => {
        setEditingCategory({ id: groupId, name: newName });
    };

    const handleSaveCategory = async (groupId) => {
        if (!editingCategory || editingCategory.name.trim() === "") {
            setError("Category name cannot be empty");
            return;
        }
        try {
            const updatedCategory = await updateElectiveGroup(groupId, editingCategory.name);
            setCategories(categories.map((category) => (category.id === groupId ? updatedCategory : category)));
            setEditingCategory(null);
        } catch (error) {
            setError("Failed to update category");
        }
    };


    return (
        <div>
            <h2 className="mb-4">Lag, endre eller fjern kategorier for valgemner</h2>

            {Loading && <p className="text-muted">Loading categories...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="input-group mb-4">
                <input
                    type="text"
                    id="addingCategory"
                    name="addingCategory"
                    placeholder="Skriv kategorinavn..."
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="form-control"
                />
                <button onClick={handleAddCategory} className="btn btn-outline-success">
                    Legg til kategori
                </button>
            </div>

            <ul className="list-group mb-2">
                {categories.map((category) => (
                    <li key={category.id} className="list-group-item">
                        {editingCategory && editingCategory.id === category.id ? (
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="editCategory"
                                    name="editCategory"
                                    value={editingCategory.name}
                                    onChange={(e) => handleEditCategory(category.id, e.target.value)}
                                    className="form-control"
                                />
                                <button onClick={() => handleSaveCategory(category.id)} className="btn btn-outline-success">
                                    Lagre
                                </button>
                                <button onClick={() => setEditingCategory(null)} className="btn btn-outline-danger">
                                    Avbryt
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{category.name}</span>
                                <div className="d-flex gap-2">
                                    <button onClick={() => handleEditCategory(category.id, category.name)} className="btn btn-sm btn-outline-primary">
                                        Rediger
                                    </button>
                                    <button onClick={() => handleDeleteCategory(category.id)} className="btn btn-sm btn-outline-danger">
                                        Slett
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <p className="text-muted small">Kategorier med emner i en studieplan kan ikke slettes</p>
        </div>
    );
};

export default ValgemneKategoriForm;