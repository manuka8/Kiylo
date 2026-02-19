const ForgotPassword = () => (
    <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <p className="text-slate-500 mb-6">Enter your email and we'll send you a reset link.</p>
        <input type="email" placeholder="Email Address" className="input mb-4" />
        <button className="btn btn-primary w-full">Send Reset Link</button>
    </div>
);
export default ForgotPassword;
