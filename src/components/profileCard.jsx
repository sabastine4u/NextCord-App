import React, {useState} from 'react';

function ProfileCard({user}) {
    //1. State management for interractivity
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(629);
    const [followerCount, setFollowerCount] = useState(1500);

    //2. write all your handlers
    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        setFollowerCount(isFollowing ? followerCount -1 : followerCount + 1)
    }
    const styles = {
        card: {
            width: '320px', 
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            padding:'20px'
        },
    profilePic: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #f0f2f5'
    },
     name: { margin: '10px 0 5px', fontSize: '22px', fontWeight: 'bold' },
     handle: { color: '#65676b', marginBottom: '15px' },
    statsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      borderTop: '1px solid #eee',
      paddingTop: '15px',
      marginBottom: '20px'
    },
    statItem: { fontSize: '14px', color: '#65676b' },
    statValue: { display: 'block', fontWeight: 'bold', color: '#000', fontSize: '18px' },
    buttonGroup: { display: 'flex', gap: '10px', justifyContent: 'center' },
    btn: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: '0.2s'
    }
    }
    return (
    <div style={styles.card}>
        <img style={styles.profilePic} src={user.image}
        alt= {user.username}
        />

        <h2 style={styles.name}>{user.firstName} {user.lastName}</h2>
        <p style={styles.handle}>@{user.username}</p>
        <p style={styles.handle}>city: {user.address.city}</p>


        <div style={styles.statsContainer}>
            <div style={styles.statItem}>
                <span style={styles.statValue}>
                    {followerCount.toLocaleString()}
                </span> Followers
            </div>
            <div  style={styles.statItem}>
                <span style={styles.statValue}>
                    {likesCount.toLocaleString()}
                </span> Likes
            </div>
        </div>

        <div style={styles.buttonGroup}>
            <button
             onClick={handleFollow}
             style={{...styles.btn, backgroundColor: isFollowing? '#e4e6eb': '#007bff',
            color: isFollowing? '#050505': '#fff'
            }}>{isFollowing? 'Unfollow': 'follow'
            }</button>
            <button
            style={{...styles.btn, backgroundColor: isLiked? '#ff4757': '#f0f2f5',
            color: isLiked? '#fff': '#050505'
            }}
            >{isLiked? '🧡': '🤍'}</button>
        </div>
    </div>
  )
}

export default ProfileCard