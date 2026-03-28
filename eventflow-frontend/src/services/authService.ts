

const API = process.env.NEXT_PUBLIC_API_URL;

export async function signup(name: string, email:string,password:string) {
    const data = {
        name:name,
        email:email,
        password:password
    }

    const res = await fetch(`${API}/users`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data),
    })
    return res.json();
}

export async function login(email:string, password:string) {
    const data = {
        email:email,
        password:password
    }
    const res = await fetch(`${API}/auth/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
    return res.json();
}