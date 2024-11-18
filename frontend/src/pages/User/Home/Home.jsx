import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
    const { userInfo } = useSelector((state) => state.user);

    return (
        <div>
            {userInfo ? (
                <>
                    <h3>Welcome {userInfo.name}</h3>
                    <p>Email: {userInfo.email}</p>
                    {userInfo.image && <img src={userInfo.image} alt="User" />}
                </>
            ) : (
                <h3>Loading...</h3>
            )}
        </div>
    );
};

export default Home;
