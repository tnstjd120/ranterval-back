const array1 = [
    "우아한", "하늘의", "세상에", "용감한", "신비로운", "사랑스러운", "평화로운", 
    "빛나는", "청명한", "용맹한", "온화한", "강력한", "예리한", "부드러운", 
    "쾌활한", "무서운", "자유로운", "기발한", "현명한", "열정적인", "힘찬", 
    "조용한", "느긋한", "화려한", "자연의", "용의", "호랑이의", "거대한", 
    "작은", "놀라운"
  ];
  
  const array2 = [
    "태어난", "뭐머한", "당당한", "지혜로운", "친절한", "사려깊은", "자신감있는", 
    "활기찬", "침착한", "성실한", "정직한", "고요한", "낙천적인", "결단력있는", 
    "사려깊은", "유쾌한", "생동감있는", "따뜻한", "예의바른", "신중한", 
    "민첩한", "용감한", "호기심많은", "절제있는", "자기주도적인", "열정적인", 
    "희망찬", "열린마음의", "정중한", "기대가득한"
  ];
  
  const array3 = [
    "거북이", "원숭이", "코끼리", "사자", "호랑이", "고양이", "강아지", 
    "독수리", "늑대", "여우", "판다", "말", "사슴", "고릴라", "악어", 
    "참새", "돌고래", "상어", "코뿔소", "하마", "양", "소", "돼지", 
    "토끼", "나비", "부엉이", "두더지", "두루미", "얼룩말", "청설모"
  ];

  export function generateRandomNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }
  
  export function getRandomItem(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  export function createRandomNickname() {
    const part1 = getRandomItem(array1);
    const part2 = getRandomItem(array2);
    const part3 = getRandomItem(array3);
    const randomNumber = generateRandomNumber();
  
    return `${part1}${part2}${part3}${randomNumber}`;
  }