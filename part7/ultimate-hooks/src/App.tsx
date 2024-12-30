import { useState, useEffect } from "react";
import axios from "axios";

interface Resource {
  id: number;
}

type Note = Resource & {
  content: string;
};

type Person = Resource & {
  name: string;
  number: string;
};

const useField = (type: string) => {
  const [value, setValue] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useResource = (baseUrl: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(baseUrl);
      setResources(response.data);
    };
    fetch();
  }, [hasChanged]);

  const create = (resource: Omit<Note, "id"> | Omit<Person, "id">) => {
    const newResource = { ...resource, id: resources.length + 1 } as Resource;
    axios.post(baseUrl, newResource);
    setHasChanged(!hasChanged);
  };

  const service = {
    create,
  };

  return [resources, service];
};

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes") as [
    Note[],
    { create: (note: Omit<Note, "id">) => void },
  ];
  const [persons, personService] = useResource(
    "http://localhost:3005/persons",
  ) as [Person[], { create: (person: Omit<Person, "id">) => void }];

  const handleNoteSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    noteService.create({ content: content.value });
  };

  const handlePersonSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
