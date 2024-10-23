import LoginForm from "@/components/form/LoginForm";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {

  return (
    <main className="wh-full min-h-screen bg-form grid place-items-center p-6">
      <LoginForm resetPassword={searchParams.resetPassword}/>
    </main>
  );
}