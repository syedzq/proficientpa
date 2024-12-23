import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function AuthButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }

  return (
    <div className="flex gap-2">
      <SignInButton mode="modal">
        <button className="px-4 py-2 text-sm font-geist text-gray-700 hover:text-gray-900 transition-colors">
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-4 py-2 text-sm font-geist bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
} 