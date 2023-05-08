import React from "react";
import { navLinks } from "../data";
import Link from "next/link";
import { ButtonText } from "@/components/atoms";
import styles from '@/styles/NavBar.module.css';
import { useRouter } from "next/router";


export default function Header() {
  const router = useRouter();
  const currentRoute = router.pathname;
  return (
    <header>
      <div className={styles.topHeader}>
        <h1>FT_Trascendence</h1>
      </div>
      <nav className={styles.topNav}>
        {navLinks.map((link, index) => {
          return (
			<Link href={link.path} className={currentRoute === link.path ? styles.active : styles.nonActive}>
				{link.name}
			</Link>
		);
        })}
      </nav>
    </header>
  );
}
