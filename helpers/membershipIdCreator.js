export default function membershipIdCreator(myLength) {
  const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZX";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  const randomString = randomArray.join("");
  return randomString;
}
