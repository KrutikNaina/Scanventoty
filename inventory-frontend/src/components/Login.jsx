import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";


const Login = () => {
  const [warning, setWarning] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const listener = (event) => {
      const allowedOrigins = ["http://localhost:5000", "http://localhost:5173"];
      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data?.type === "oauth-success") {
        const token = event.data.token;

        if (token) {
          localStorage.setItem("token", token);

          // decode token payload
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser(payload);

          navigate("/dashboard"); // redirect after login
        } else {
          setWarning("Token missing in OAuth response.");
        }
      }

      window.removeEventListener("message", listener);
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [navigate]);

  const openPopup = (url) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      url,
      "GoogleAuth",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleGoogleLogin = () => {
    openPopup("http://localhost:5000/auth/google");
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* sticky header */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-neutral-950/60">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600" />
            <span className="text-white font-bold tracking-tight">
              SmartInventory
            </span>
          </div>
          <div className="text-sm text-neutral-300">Need an account?</div>
        </nav>
      </header>

      {/* center section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-center">
        <div className="w-full grid lg:grid-cols-2 gap-10 items-center">
          {/* left side info */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 text-xs text-neutral-300">
              Secure • Fast • Role-based
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight">
              Log in to manage <br /> your inventory.
            </h1>
            <p className="mt-4 text-neutral-300">
              One click with Google. Real-time stock. Error-free billing.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-neutral-300">
              <li>• SSO with Google Workspace</li>
              <li>• Role-based access: Admin, Staff, Auditor</li>
              <li>• Audit logs & session security</li>
            </ul>
          </div>

          {/* right side card */}
          <div className="p-8 bg-neutral-900 border border-white/10 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              Sign in with Google
            </h2>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 px-4 rounded-lg hover:bg-gray-100 transition"
            >
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>

            {user && (
              <div className="mt-4 text-sm text-green-400 text-center">
                ✅ Welcome, {user.name} ({user.email})
              </div>
            )}

            {warning && (
              <div className="mt-4 text-sm text-yellow-400 text-center">
                ⚠️ {warning}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;