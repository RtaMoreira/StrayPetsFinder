import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";

const useAuth = () => {
  const [authUser, setAuthUser] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const getUserInfo = async () => {
          //get user info
          await db.collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                let userInfo = doc.data();
                userInfo = { ...user, ...userInfo }; //merge user auth + personal information

                setAuthUser(userInfo);
              } else console.log("No such document");
            });
        };
        getUserInfo();
      } else {
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  return authUser;
};

export default useAuth;
