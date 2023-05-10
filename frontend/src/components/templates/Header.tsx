import React from "react";
import { navLinks } from "../Header.data";
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
		<div className={styles.text}>
			<span style={{ '--i': 1 } as React.CSSProperties}>t</span>
			<span style={{ '--i': 2 } as React.CSSProperties}>r</span>
			<span style={{ '--i': 3 } as React.CSSProperties}>a</span>
			<span style={{ '--i': 4 } as React.CSSProperties}>s</span>
			<span style={{ '--i': 5 } as React.CSSProperties}>c</span>
			<span style={{ '--i': 6 } as React.CSSProperties}>e</span>
			<span style={{ '--i': 7 } as React.CSSProperties}>n</span>
			<span style={{ '--i': 8 } as React.CSSProperties}>d</span>
			<span style={{ '--i': 9 } as React.CSSProperties}>e</span>
			<span style={{ '--i': 10 } as React.CSSProperties}>n</span>
			<span style={{ '--i': 11 } as React.CSSProperties}>c</span>
			<span style={{ '--i': 12 } as React.CSSProperties}>e</span>
		</div>
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
