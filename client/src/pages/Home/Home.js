import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvestmentPlans from '../../components/InvestmentPlans/InvestmentPlans.jsx';
import PoweredBy from "../../components/Poweredby/PoweredBy.js";
import MaximizeWealth from "../../components/MaximizeWealth/MaximizeWealth.jsx";
import PerfectPlan from "../../components/PerfectPlan/PerfectPlan.jsx";
import InvestorReviews from "../../components/InvestorReviews/InvestorReviews.jsx";
import HiddenImageComponent from "../../components/HiddenImageComponent/HiddenImageComponent.js";
import { getUser } from "../../utils/getUser.js";


export default function Home() {
  const history = useNavigate();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const fetchedUser = localStorage.getItem('userId');
    if (fetchedUser) {
      getUser(fetchedUser)
        .then((userData) => {
          if (userData) {
            setUser(userData);
            setAuthenticated(true);
            if(userData?.phone === "7976189199" || userData?.phone === '9772090543'){
              setIsAdmin(true);
            }
          } else {
            console.log('User not found');
          }
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
        });
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      console.log(user);
      if (isAdmin) {
        history('/admin');
      } else {
        history('/dashboard');
      }
    }
  }, [authenticated, isAdmin, history]);

  return (
    <>
      <MaximizeWealth/>
      <PerfectPlan/>
      <InvestorReviews/>
      <InvestmentPlans/>
      <HiddenImageComponent/>
      <PoweredBy/>
    </>
  );
}
