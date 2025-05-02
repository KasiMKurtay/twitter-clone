export const POSTS = [
  {
    _id: "101",
    text: "Check out my latest 3D animation using Blender 🎥",
    img: "/posts/post1.png",
    user: {
      username: "aiwa01",
      profileImg: "/avatars/boy1.png",
      fullName: "Kasım Kurtay",
    },
    comments: [
      {
        _id: "201",
        text: "Impressive work!",
        user: {
          username: "emilygreen",
          profileImg: "/avatars/girl1.png",
          fullName: "Emily Green",
        },
      },
    ],
    likes: ["7788a001", "7788a002", "7788a003", "7788a004"],
  },
  {
    _id: "102",
    text: "Feeling productive today! Just finished a new React component 💻",
    user: {
      username: "alexsmith",
      profileImg: "/avatars/boy2.png",
      fullName: "Alex Smith",
    },
    comments: [
      {
        _id: "202",
        text: "Great job, keep it up!",
        user: {
          username: "emilygreen",
          profileImg: "/avatars/girl2.png",
          fullName: "Emily Green",
        },
      },
    ],
    likes: ["7788a001", "7788a002", "7788a003", "7788a004"],
  },
  {
    _id: "103",
    text: "Just discovered an AI tool that writes poetry. Amazing! ✨",
    img: "/posts/post2.png",
    user: {
      username: "alexsmith",
      profileImg: "/avatars/boy3.png",
      fullName: "Alex Smith",
    },
    comments: [],
    likes: [
      "7788a001",
      "7788a002",
      "7788a003",
      "7788a004",
      "7788a005",
      "7788a006",
    ],
  },
  {
    _id: "104",
    text: "Starting a deep dive into Rust programming. Excited! 🔧",
    img: "/posts/post3.png",
    user: {
      username: "alexsmith",
      profileImg: "/avatars/boy3.png",
      fullName: "Alex Smith",
    },
    comments: [
      {
        _id: "203",
        text: "Sounds challenging, good luck!",
        user: {
          username: "emilygreen",
          profileImg: "/avatars/girl3.png",
          fullName: "Emily Green",
        },
      },
    ],
    likes: [
      "7788a001",
      "7788a002",
      "7788a003",
      "7788a004",
      "7788a005",
      "7788a006",
      "7788a007",
      "7788a008",
      "7788a009",
    ],
  },
];

export const USERS_FOR_RIGHT_PANEL = [
  {
    _id: "101",
    fullName: "Alex Smith",
    username: "alexsmith",
    profileImg: "/avatars/boy2.png",
  },
  {
    _id: "102",
    fullName: "Emily Green",
    username: "emilygreen",
    profileImg: "/avatars/girl1.png",
  },
  {
    _id: "103",
    fullName: "Michael Brown",
    username: "michaelbrown",
    profileImg: "/avatars/boy3.png",
  },
  {
    _id: "104",
    fullName: "Sophia White",
    username: "sophiawhite",
    profileImg: "/avatars/girl2.png",
  },
];
