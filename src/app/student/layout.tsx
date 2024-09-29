// student/layout.tsx
"use client";
import { ReactNode } from "react";
import NavBar from "./stdcomps/NavBar";

const StudentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {/* Navbar on top */}
      <NavBar />
      <div className="pt-16"> {/* pt-16 ensures content is below the navbar */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default StudentLayout;
