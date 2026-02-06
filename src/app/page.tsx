import { getContactsFromCSV } from "@/lib/readContacts";

export default function Home() {
  const contacts = getContactsFromCSV();

  return (
      <main className="min-h-screen bg-gray-100 p-10">
        <h1 className="text-gray-800 text-3xl font-bold mb-8">📇 Mis Contactos</h1>

        <div className="grid gap-4 max-w-lg">
          {contacts.map((contact, index) => (
              <div
                  key={index}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
              >
                <p className="text-lg font-semibold text-gray-800">
                  {contact.name}
                </p>
                <p className="text-gray-600">
                  📞 {contact.phone}
                </p>
              </div>
          ))}
        </div>
      </main>
  );
}
