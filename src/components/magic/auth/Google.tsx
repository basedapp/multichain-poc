import { useMagic } from '../../../providers/MagicProvider';
import { useEffect, useState } from 'react';
import { saveUserInfo } from '@/utils/common';
import Spinner from '../../ui/Spinner';
import Image from 'next/image';
import google from 'public/social/Google.svg';
import Card from '../../ui/Card';
import CardHeader from '../../ui/CardHeader';




const Google = () => {
  const { isLoggedIn, oauthLogin, isAuthLoading, setIsAuthLoading } = useMagic();




  const login = async () => {
    oauthLogin("google");
  };


  return (
    <Card>
      <CardHeader id="google">Google Login</CardHeader>
      {isAuthLoading ? (
        <Spinner />
      ) : (
        <div className="login-method-grid-item-container">
          <button
            className="social-login-button"
            onClick={() => {
              if (!isLoggedIn) login();
            }}
            disabled={isLoggedIn}
          >
            <Image src={google} alt="Google" height={24} width={24} className="mr-6" />
            <div className="w-full font-semibold text-center text-xs">Continue with Google</div>
          </button>
        </div>
      )}
    </Card>
  );
};
export default Google;
