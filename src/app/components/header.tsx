import Link from "next/link"
import { getUserFromCookie } from "../actions/getUser"
import { logout } from "../actions/userController"

export default async function Header(){
    const user = await getUserFromCookie()

    return(
        <header className="bg-gray-700  shadow-md">
            <div className="container mx-auto">
                <div className="navbar">
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">
                            {user && (
                                <li>
                                <form action={logout} className="btn btn-neutral">
                                    <button>Log out</button>
                                </form>
                                </li>
                            )}
                            {!user && (
                                <li>
                                <Link href="/login">Log in</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}