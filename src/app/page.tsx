import Image from "next/image";
import RegisterForm from "./components/RegisterForm";
import { getUserFromCookie } from "./actions/getUser";

export default async function Home() {
  const user = await getUserFromCookie()

  return (
    <>
    {user && <p className='text-center text-2xl text-gray-800 mb-5'>You are already logged in</p>}
    {!user && (
      <div>
        <p className='text-center text-2xl text-gray-800 mb-5'>Don&rsquo;t have an account? <strong>Create one</strong></p>
        <RegisterForm />
      </div>
    )}
    </>
  );
}
