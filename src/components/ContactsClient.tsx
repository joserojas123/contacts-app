"use client";

import { useMemo, useState } from "react";
import {
    deleteContact,
    restoreContactAction,
    deleteContactForeverAction,
    addContactAction,
    updateContactAction,
} from "@/app/actions";

export type Contact = {
    name: string;
    phone: string;
    active: boolean;
};

export default function ContactsClient({ contacts }: { contacts: Contact[] }) {
    const [contactList, setContactList] = useState<Contact[]>(contacts);
    const [search, setSearch] = useState("");
    const [view, setView] = useState<"active" | "trash">("active");

    const [deleteSoft, setDeleteSoft] = useState<Contact | null>(null);
    const [deleteHard, setDeleteHard] = useState<Contact | null>(null);
    const [editContact, setEditContact] = useState<Contact | null>(null);
    const [showAdd, setShowAdd] = useState(false);

    const filtered = useMemo(
        () =>
            contactList.filter(
                (c) =>
                    c.active === (view === "active") &&
                    c.name.toLowerCase().includes(search.toLowerCase())
            ),
        [contactList, search, view]
    );

    /* ---------- acciones ---------- */

    const addContact = async (name: string, phone: string) => {
        await addContactAction(name, phone);
        setContactList([...contactList, { name, phone, active: true }]);
        setShowAdd(false);
    };

    const confirmDeleteSoft = async () => {
        if (!deleteSoft) return;
        await deleteContact(deleteSoft.name);
        setContactList((prev) =>
            prev.map((c) =>
                c.name === deleteSoft.name ? { ...c, active: false } : c
            )
        );
        setDeleteSoft(null);
    };

    const restore = async (c: Contact) => {
        await restoreContactAction(c.name);
        setContactList((prev) =>
            prev.map((x) => (x.name === c.name ? { ...x, active: true } : x))
        );
    };

    const confirmDeleteHard = async () => {
        if (!deleteHard) return;
        await deleteContactForeverAction(deleteHard.name);
        setContactList((prev) =>
            prev.filter((c) => c.name !== deleteHard.name)
        );
        setDeleteHard(null);
    };

    const updateContact = async (
        oldName: string,
        name: string,
        phone: string
    ) => {
        await updateContactAction(oldName, name, phone);
        setContactList((prev) =>
            prev.map((c) =>
                c.name === oldName ? { ...c, name, phone } : c
            )
        );
        setEditContact(null);
    };

    return (
        <main className="h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-xl">

                {/* HEADER */}
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-black">📇 Mis Contactos</h1>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="w-10 h-10 bg-blue-600 text-white rounded-full text-2xl"
                    >
                        +
                    </button>
                </div>

                {/* BUSCADOR */}
                <div className="px-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar..."
                        className="w-full px-4 py-2 border rounded text-black"
                    />
                </div>

                {/* TABS */}
                <div className="flex justify-center gap-4 px-4 mt-3">
                    <button
                        onClick={() => setView("active")}
                        className={`px-4 py-1 rounded ${
                            view === "active"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-black"
                        }`}
                    >
                        Activos
                    </button>
                    <button
                        onClick={() => setView("trash")}
                        className={`px-4 py-1 rounded ${
                            view === "trash"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-black"
                        }`}
                    >
                        Papelera
                    </button>
                </div>

                {/* LISTA */}
                <div className="p-4 space-y-3">
                    {filtered.map((c) => (
                        <div
                            key={c.name}
                            className="bg-white p-4 rounded shadow flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold text-black">{c.name}</p>
                                <p className="text-sm text-gray-700">{c.phone}</p>
                            </div>

                            {view === "active" ? (
                                <div className="flex gap-3">
                                    <button onClick={() => setEditContact(c)}>✏️</button>
                                    <button onClick={() => setDeleteSoft(c)}>❌</button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => restore(c)}>♻️</button>
                                    <button onClick={() => setDeleteHard(c)}>🗑️</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* MODALES */}
            {editContact && (
                <EditContactModal
                    contact={editContact}
                    contacts={contactList}
                    onClose={() => setEditContact(null)}
                    onSave={updateContact}
                />
            )}

            {showAdd && (
                <AddContactModal
                    contacts={contactList}
                    onAdd={addContact}
                    onClose={() => setShowAdd(false)}
                />
            )}

            {/* MODAL ELIMINAR (SOFT) */}
            {deleteSoft && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-80">
                        <h2 className="font-semibold text-black mb-4">
                            ¿Enviar contacto a la papelera?
                        </h2>
                        <p className="text-sm text-gray-700 mb-4">{deleteSoft.name}</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteSoft(null)}>Cancelar</button>
                            <button
                                onClick={confirmDeleteSoft}
                                className="text-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR DEFINITIVO */}
            {deleteHard && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-80">
                        <h2 className="font-semibold text-black mb-4">
                            Eliminar definitivamente
                        </h2>
                        <p className="text-sm text-gray-700 mb-4">{deleteHard.name} no podrá recuperarse</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteHard(null)}>Cancelar</button>
                            <button
                                onClick={confirmDeleteHard}
                                className="text-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

/* ---------- MODAL EDITAR ---------- */
function EditContactModal({ contact, contacts, onSave, onClose }: any) {
    const [name, setName] = useState(contact.name);
    const [phone, setPhone] = useState(contact.phone);
    const [error, setError] = useState("");

    const submit = async () => {
        if (!name || !phone) {
            setError("Campos obligatorios");
            return;
        }

        if (contacts.some((c: Contact) => c.name === name && c.name !== contact.name)) {
            setError("Nombre duplicado");
            return;
        }

        if (contacts.some((c: Contact) => c.phone === phone && c.name !== contact.name)) {
            setError("Celular duplicado");
            return;
        }

        await onSave(contact.name, name, phone);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-80">
                <h2 className="mb-4 font-semibold text-black">✏️ Editar contacto</h2>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-2 border px-3 py-2 rounded text-black"
                />
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mb-2 border px-3 py-2 rounded text-black"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={submit} className="text-blue-600">Guardar</button>
                </div>
            </div>
        </div>
    );
}

/* ---------- MODAL AGREGAR ---------- */
function AddContactModal({ contacts, onAdd, onClose }: { contacts: Contact[], onAdd: (name: string, phone: string) => void, onClose: () => void }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    const submit = () => {
        if (!name || !phone) {
            setError("Todos los campos son obligatorios");
            return;
        }

        if (contacts.some((c) => c.name === name)) {
            setError("El nombre ya existe");
            return;
        }

        if (contacts.some((c) => c.phone === phone)) {
            setError("El celular ya existe");
            return;
        }

        onAdd(name, phone);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-80">
                <h2 className="font-semibold mb-4 text-black">➕ Nuevo contacto</h2>
                <input
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-3 border px-3 py-2 rounded text-black"
                />
                <input
                    placeholder="Celular"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mb-3 border px-3 py-2 rounded text-black"
                />
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                <div className="flex justify-end gap-3">
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={submit} className="text-blue-600">Agregar</button>
                </div>
            </div>
        </div>
    );
}
