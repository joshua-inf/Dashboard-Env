// // components/ProtectedRoute.tsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "../hooks/useUser;
// import { ReactNode } from "react";
// import Loader from "./common/Loader";

// export default function ProtectedRoute({ children }: { children: ReactNode }) {
//   const { data: user, isLoading } = useUser();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading && !user) {
//       router.push("/login");
//     }
//   }, [user, isLoading, router]);

//   if (isLoading) return <Loader />;

//   return <>{user ? children : null}</>;
// }
