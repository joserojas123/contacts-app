import { readContacts } from "@/lib/readContacts";
import ContactsClient from "@/components/ContactsClient";

export default function Page() {
    const contacts = readContacts();

    return <ContactsClient contacts={contacts} />;
}
