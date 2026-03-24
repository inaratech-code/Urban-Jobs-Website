"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface EmployerFormValues {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
}

interface EmployerFormProps {
  onSubmit: (data: EmployerFormValues) => Promise<void>;
  isLoading?: boolean;
}

const initial: EmployerFormValues = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
};

export default function EmployerForm({ onSubmit, isLoading }: EmployerFormProps) {
  const [form, setForm] = useState<EmployerFormValues>(initial);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.contactPerson || !form.phone || !form.email) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      await onSubmit(form);
      setForm(initial);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Company Name *
        </label>
        <input
          type="text"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          placeholder="Your company name"
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contact Person *
          </label>
          <input
            type="text"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="Full name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="98XXXXXXXX"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          placeholder="email@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          placeholder="Company address"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 shadow-soft hover:shadow-soft-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </motion.form>
  );
}
