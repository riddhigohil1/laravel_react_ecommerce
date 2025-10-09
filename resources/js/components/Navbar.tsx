import { dashboard, login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import NavbarCart from './NavbarCart';

function Navbar() {
    const { auth, totalQuantity, totalPrice, cartItems } =
        usePage<SharedData>().props;
    const appName = import.meta.env.VITE_APP_NAME;

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link href="/" className="btn text-xl btn-ghost">
                    {appName}
                </Link>
            </div>
            <div className="flex-none">
                <NavbarCart />
                {auth.user ? (
                    <div className="dropdown dropdown-end mx-4">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn avatar btn-circle btn-ghost"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu z-1 mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
                        >
                            <li>
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={logout()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <Link href={login()} className="btn mx-4">
                            Log in
                        </Link>
                        <Link href={register()} className="btn btn-primary">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;
