const API = process.env.NEXT_PUBLIC_API_URL;

export async function getEvents() {
  const res = await fetch(`${API}/events`);
  return res.json();
}

export async function getEventById(id: string) {
  const res = await fetch(`${API}/events/${id}`);
  return res.json();
}

export async function registerEvent(id: string, data: any) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}/events/${id}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getMyEvents() {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}/my-events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function createEvent(data: any) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}/create-event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}
