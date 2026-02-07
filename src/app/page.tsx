import { getContacts } from "@/lib/contacts";
import ContactsClient from "@/components/ContactsClient";

export default function HomePage() {
    const contacts = getContacts();

    return <ContactsClient contacts={contacts} />;
}
