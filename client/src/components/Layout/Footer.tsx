function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Contact</h4>
          <p className="mt-2 text-sm text-slate-600">support@localchefbazaar.com</p>
          <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Social</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Twitter</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Working Hours</h4>
          <p className="mt-2 text-sm text-slate-600">Mon-Sun: 8:00 AM - 11:00 PM</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">About</h4>
          <p className="mt-2 text-sm text-slate-600">
            Fresh, homemade meals from local chefs, ordered in seconds with real-time tracking.
          </p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} LocalChefBazaar. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;








