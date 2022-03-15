import { useEffect, useState, useMemo } from "react";
import Head from "next/head";

import dataPersons from "../persons.json";

import styles from "../styles/Home.module.css";

let api = (person) =>
  new Promise(function (resolve, reject) {
    let rand = Math.floor(Math.random() * 500) + 500;

    //flag to test failed request
    let error = false;

    !error
      ? setTimeout(() => resolve(rand), rand)
      : reject("Internal Server Error");
  });

export default function Home() {
  const [persons, setPersons] = useState([]);

  const olderThan34 = useMemo(
    () =>
      dataPersons
        .filter((p) => p.age >= 35)
        .map((p) => {
          return { ...p, name: p.name.split(" ").reverse().join(" ") };
        }),
    []
  );

  useEffect(() => {
    const fetchSalary = () => {
      const withSalary = olderThan34.map(async (p) => {
        try {
          const salary = await api(p);

          return { ...p, salary };
        } catch (error) {
          console.log(error);
          /**
           *  return 0 if the api fails
           */
          return 0;
        }
      });

      Promise.all(withSalary).then((r) => {
        setPersons(r);
        const total = r.reduce((acc, current) => acc + current.salary, 0);
        console.log("total ==>", total);
      });
    };

    fetchSalary();
  }, [olderThan34]);

  return (
    <div>
      <Head>
        <title>Payroll</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Payroll</h1>

        <ul className={styles.content}>
          {persons.map((p) => (
            <li key={p.name} className={styles.person}>
              <div>{p.name} </div>
              <div>$ {p.salary}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
