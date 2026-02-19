const ResetPassword = () => (
    <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <p className="text-slate-500 mb-6">Enter your new password below.</p>
        <input type="password" placeholder="New Password" className="input mb-4" />
        <input type="password" placeholder="Confirm Password" className="input mb-4" />
        <button className="btn btn-primary w-full">Reset Password</button>
    </div>
);
export default ResetPassword;
