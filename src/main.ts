// Importing 'sass' :
import "./main.scss";

// Importing 'Contact' type to work with :
import { Contact } from "./contact";

// Get main from HTML side and insert it to code :
const main = document.querySelector<HTMLElement>(".main");

// HTML code of 'main' tag :
const items = `
    <ul class='main__contact-list'>
    </ul>
    <ul class='main__modify-buttons'>
        <button id='addBtn' class='main__add-contact'>
            <i class="fa-solid fa-user-plus"></i>
            <p>Add</p>
        </button>
        <button id='removeBtn' class='main__add-contact'>
            <i class="fa-solid fa-remove"></i>
            <p>Remove</p>
        </button>
        <button id='editBtn' class='main__add-contact'>
            <i class="fa-solid fa-user-edit"></i>
            <p>Edit</p>
        </button>
    </ul>
`;

// Adding items to 'main' tag :
main?.insertAdjacentHTML("afterbegin", items);

// Global variable that keeps all contacts inside :
let contacts: Contact[] = [];

// Global variable that keeps currently contacts on page :
let currentPageContacts: Contact[] = [];

// Currently page index :
let currentPage = 1;

// When window opens gets all contacts from local-storage :
window.addEventListener("load", async () => {
  updateUI();
});

// Async Functions with global variables :

// Async Functions that adds contact and updates UI :
async function addContact(contact: Contact): Promise<void> {
  contacts.unshift(contact);
  writeContactsToLocalStorage();
  updateUI();
}

// Async Function that deletes contact and updates UI :
async function deleteContact(index: number): Promise<void> {
  if (index > -1) {
    contacts.splice(index, 1);
  }
  writeContactsToLocalStorage();
  updateUI();
}

async function editContact(index: number, identifier: string, value: string) {
  if (identifier == "name") {
    contacts[index].name = value;
  } else if (identifier == "surname") {
    contacts[index].surname = value;
  } else if (identifier == "email") {
    contacts[index].email = value;
  } else if (identifier == "mobile") {
    contacts[index].mobile = value;
  }
  writeContactsToLocalStorage();
  updateUI();
}

// Functions with local-storage :

// Get 'Contacts' from local-storage and parse it to array :
async function getContactsFromLocalStorage(): Promise<void> {
  if (localStorage.getItem("contacts") == null) return;
  const parsedData = JSON.parse(
    localStorage.getItem("contacts") as string
  ) as Contact[];
  contacts = parsedData;
}

// Write global 'Contacts' to local-storage :
async function writeContactsToLocalStorage(): Promise<void> {
  localStorage.setItem("contacts", JSON.stringify(contacts));
  updateUI();
}

// Function that takes currently contacts and updates UI :
async function updateUI(): Promise<void> {
  getContactsFromLocalStorage();
  const contactList = main?.querySelector<HTMLUListElement>(
    ".main__contact-list"
  );
  contactList!.innerHTML = "";
  contacts.forEach((c) => {
    const li = `<li class='contact-card'>
                    <p>Name:${c.name}</p>
                    <p>Surname:${c.surname}</p>
                    <p>Mobile:${c.mobile}</p>
                    <p>Email:${c.email}</p>
                </li>`;
    contactList?.insertAdjacentHTML("beforeend", li);
  });
}

// Writing events for modify buttons :
const addBtn = document.querySelector("#addBtn");
const removeBtn = document.querySelector("#removeBtn");
const editBtn = document.querySelector("#editBtn");

// Listener for add button :
addBtn?.addEventListener("click", async (e) => {
  // Delete form if it exsists :
  const form = document.querySelector("form");
  if (form != undefined) {
    alert("VAR");
    form.remove();
  }

  e.preventDefault();
  const contactForm = document.createElement("form");
  contactForm.id = "#form";
  contactForm.innerHTML = `
    <label for="name">Name:</label>
    <input type="text" id="name" name="name"><br><br>
    <label for="surname">Surname:</label>
    <input type="text" id="surname" name="surname"><br><br>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email"><br><br>
    <label for="mobile">Mobile:</label>
    <input type="tel" id="mobile" name="mobile"><br><br>
    <input type="submit" value="Add Contact">
    `;
  main?.appendChild(contactForm);
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector<HTMLInputElement>("#name")
      ?.value as string;
    const surname = document.querySelector<HTMLInputElement>("#surname")
      ?.value as string;
    const email = document.querySelector<HTMLInputElement>("#email")
      ?.value as string;
    const mobile = document.querySelector<HTMLInputElement>("#mobile")
      ?.value as string;
    const c: Contact = {
      name: name,
      surname: surname,
      email: email,
      mobile: mobile,
    };
    addContact(c);
    contactForm.remove();
  });
});

// Listener for edit button :
editBtn?.addEventListener("click", async (e) => {
  removeBtn?.removeEventListener("click", async (e) => {});

  alert("SELECT CONTACT TO EDIT .");
  const contact_list = document.querySelector(
    ".main__contact-list"
  ) as HTMLUListElement;

  const contacts_ = contact_list.children;

  for (let i = 0; i < contacts.length; i++) {
    contacts_[i].addEventListener("click", async (e) => {
      const p = e.target as HTMLParagraphElement;
      if (p.tagName == "P") {
        if (editIndex == false) {
          editIndex = true;
          p.insertAdjacentHTML("beforeend", '<input type="text">');
          p.lastElementChild?.addEventListener("keydown", (e) => {
            const key = (e as KeyboardEvent).key;
            if (key == "Enter") {
              const identifier = p.textContent
                ?.split(":")[0]
                .toLocaleLowerCase() as string;
              const value = (p.lastChild as HTMLInputElement).value;
              editIndex = false;
              editContact(i, identifier, value);
            } else if (key == "Escape") {
              p.lastElementChild?.remove();
              editIndex = false;
            }
          });
        } else {
          alert("AT FIRST CHANGE ONE ITEM !");
        }
      }
    });
  }
});

let editIndex = false;

// Listener for delete button :
removeBtn?.addEventListener("click", async (e) => {
  editBtn?.removeEventListener("click", async (e) => {});
  alert("SELECT CONTACT TO  DELETE .");
  const contact_list = document.querySelector(
    ".main__contact-list"
  ) as HTMLUListElement;

  const contacts_ = contact_list.children;

  for (let i = 0; i < contacts.length; i++) {
    contacts_[i].addEventListener("click", async (e) => {
      deleteContact(i);
    });
  }
});
