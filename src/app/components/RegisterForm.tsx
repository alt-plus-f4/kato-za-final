"use client"
import { useActionState } from "react";
import { register } from "../actions/userController";

export default function RegisterForm() {
    const formStateHandler = async (_state: any, formData: FormData) => {
        return await register(formData);
    };

    const [formState, formAction] = useActionState(formStateHandler, { success: false, errors: {} });

    return (
        <form action={formAction} className='max-w-xs mx-auto'>
            <div className="mb-3">
                <input name="username" autoComplete='off' type="text" placeholder="Username" className="input" />
                {formState.errors?.username && (
                    <div role="alert" className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formState.errors.username}</span>
                    </div>
                )}
            </div>
            <div className="mb-3">
                <input name="email" autoComplete='off' type="email" placeholder="Email" className="input" />
                {formState.errors?.email && (
                    <div role="alert" className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formState.errors.email}</span>
                    </div>
                )}
            </div>
            <div className="mb-3">
                <input name="password" autoComplete='off' type="password" placeholder="Password" className="input" />
                {formState.errors?.password && (
                    <div role="alert" className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formState.errors.password}</span>
                    </div>
                )}
            </div>
            <button className="btn">Create Account</button>
        </form>
    );
}
