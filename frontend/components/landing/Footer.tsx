import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-purple-50 border-t border-purple-200/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">FlowSync</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Elevating productivity for teams worldwide. Crafted with precision
              by the FlowSync Team.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-purple-200/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 FlowSync Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons */}
            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}
