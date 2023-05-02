import { YoutubeSnippetsWithPage } from '@/lib/videos';

export const fetchDummyData = (pageToken?: string): YoutubeSnippetsWithPage => {
  if (pageToken) {
    return (
      dummyData.find((d) => d.pageToken === pageToken) || {
        datas: dummyData[dummyData.length - 1].datas,
        nextPageToken: null,
      }
    );
  } else {
    return dummyData[0];
  }
};

const dummyData = [
  {
    pageToken: null,
    datas: [
      {
        id: 'qKRGsHDXNa0',
        imgUrl: 'https://i.ytimg.com/vi/qKRGsHDXNa0/maxresdefault.jpg',
        title: '침착맨 A.I. 모음집',
        description:
          '관련 영상 •인공지능 빅스비 설정하기: https://youtu.be/efM331Fa5GY •제네시스 G80의 놀라운 기능: https://youtu.be/RSM04ztYJ3E ...',
      },
      {
        id: 'LqJHGEMZ1YU',
        imgUrl: 'https://i.ytimg.com/vi/LqJHGEMZ1YU/maxresdefault.jpg',
        title: '(잔인주의) 서부시대 무신사룩 쇼핑 브이로그',
        description:
          '관련 영상 •너굴모자를 쓰는 자 그 무게를 견뎌라: https://youtu.be/Hb4tRPdCt6M ▷관련 재생목록 •레드 데드 리뎀션 2 (Red Dead ...',
      },
      {
        id: 'A5J8DfvPt28',
        imgUrl: 'https://i.ytimg.com/vi/A5J8DfvPt28/maxresdefault.jpg',
        title: '내 자취방을 윤택하게 해줄 단 하나의 요정은? Remastered',
        description:
          '관련 영상 •【침&펄】 내 자취방을 윤택하게 해줄 단 하나의 요정은?: https://youtu.be/tGBDyStMr68 ▷관련 재생목록 •침착맨의 일상 ...',
      },
      {
        id: '6Di6dOV396k',
        imgUrl: 'https://i.ytimg.com/vi/6Di6dOV396k/maxresdefault.jpg',
        title: '&#39;A WAY OUT&#39; 하이라이트 모음집',
        description: '관련 재생목록 •【침착맨X주호민】 어 웨이 아웃 (A WAY OUT): ...',
      },
      {
        id: 'mikIpYryHqo',
        imgUrl: 'https://i.ytimg.com/vi/mikIpYryHqo/maxresdefault.jpg',
        title: '천하제일 편식대회! 식사 메뉴 월드컵 Remastered',
        description:
          '관련 영상 •【침착맨】 천하제일 편식대회! 식사 메뉴 월드컵 1부: https://youtu.be/3lMSyPHLHyo ▷관련 재생목록 •침착맨의 이상형 ...',
      },
      {
        id: 'cc8cPIR_fy8',
        imgUrl: 'https://i.ytimg.com/vi/cc8cPIR_fy8/maxresdefault.jpg',
        title: '침착맨의 야간상담소 Remastered',
        description:
          '관련 영상 •【침착맨】 무엇이든 물어보세요 시청자 상담소: https://youtu.be/esymT2uCZjg ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'f2hlMqmHStQ',
        imgUrl: 'https://i.ytimg.com/vi/f2hlMqmHStQ/maxresdefault.jpg',
        title: '와우산 미세먼지 체험기 Remastered',
        description:
          '관련 영상 •【침펄풍】 와우산 미세먼지 체험기: https://youtu.be/r8cydvrGYfs ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'Z2A5INv7Q7U',
        imgUrl: 'https://i.ytimg.com/vi/Z2A5INv7Q7U/maxresdefault.jpg',
        title: '도전! 사투리 능력고사',
        description:
          '관련 영상 •시청자들과 함께 방구석 전국 팔도 유람: https://youtu.be/3hQcbrP2nn4 ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'YNezKdTm6hM',
        imgUrl: 'https://i.ytimg.com/vi/YNezKdTm6hM/maxresdefault.jpg',
        title: '가장 맛있는 과자 순위 정하기',
        description:
          '관련 영상 •경력 40년 과자 전문가의 아들, 침착맨이 뽑은 최고의 파이형 과자 월드컵: https://youtu.be/l2IGuOG8AOM ▷관련 재생목록 ...',
      },
      {
        id: 'sLXjsA3r6Ak',
        imgUrl: 'https://i.ytimg.com/vi/sLXjsA3r6Ak/maxresdefault.jpg',
        title: '스즈메의 문단속(Suzume, 2023) 감상회',
        description:
          "관련 영상 •【침&펄 영화 만들기】 #1 - '뇌파 vs 초음파' 등장인물 편: https://youtu.be/YYKrnBqh_eo ▷관련 재생목록 •침착맨의 일상 ...",
      },
      {
        id: '5z3LQkxR3y4',
        imgUrl: 'https://i.ytimg.com/vi/5z3LQkxR3y4/maxresdefault.jpg',
        title: '또 돌아온 판사 침착맨의 양형 체험 프로그램',
        description:
          '관련 영상 •돌아온 판사 침착맨의 양형 체험 프로그램: https://youtu.be/xcSmfXq1WOQ ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: '2JbgpQa0rV4',
        imgUrl: 'https://i.ytimg.com/vi/2JbgpQa0rV4/maxresdefault.jpg',
        title: '컴퓨터 팬 소음 잡는 팁',
        description:
          '관련 영상 •【침착맨】 노이즈가 심하다구요? 본격 세팅 방송: https://youtu.be/QS3d1ZkM8N8 •【침착맨】 낯빛이 어둡다구요?',
      },
      {
        id: 'iYPFRvQ9Jr4',
        imgUrl: 'https://i.ytimg.com/vi/iYPFRvQ9Jr4/maxresdefault.jpg',
        title: '춘추제로시대',
        description:
          '관련 영상 •제로 떡볶이 쿡방: https://youtu.be/8oxUo5b3-2M ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'Hb4tRPdCt6M',
        imgUrl: 'https://i.ytimg.com/vi/Hb4tRPdCt6M/maxresdefault.jpg',
        title: '(잔인주의) 너굴모자를 쓰는 자 그 무게를 견뎌라',
        description:
          '관련 영상 •(잔인주의) 너굴맨의 개과천선: https://youtu.be/l1Vncs1qw_M ▷관련 재생목록 •레드 데드 리뎀션 2 (Red Dead ...',
      },
      {
        id: 'Ynn6cHoPWbE',
        imgUrl: 'https://i.ytimg.com/vi/Ynn6cHoPWbE/maxresdefault.jpg',
        title: '미라는 왜 만들어졌을까?',
        description:
          '관련 영상 •이집트 전문가의 카트라이더 이집트 맵 분석하기: https://youtu.be/vagBS9UA6RE ▷관련 재생목록 •침착맨과 특강: ...',
      },
      {
        id: '8oxUo5b3-2M',
        imgUrl: 'https://i.ytimg.com/vi/8oxUo5b3-2M/maxresdefault.jpg',
        title: '제로 떡볶이 쿡방',
        description:
          '관련 영상 •제로 떡볶이는 가능한가: https://youtu.be/Ge2iZZr43_Y ▷관련 재생목록 •  ‍  불만 피우면 쿡방: ...',
      },
      {
        id: 'wgsNwALH17g',
        imgUrl: 'https://i.ytimg.com/vi/wgsNwALH17g/maxresdefault.jpg',
        title: '랜덤 물건 가격 맞히기',
        description:
          '관련 영상 •미술 작품 가격 맞히기: https://youtu.be/yZv-Lc6sAtU ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ...',
      },
      {
        id: 'BnMR8E8mB0E',
        imgUrl: 'https://i.ytimg.com/vi/BnMR8E8mB0E/maxresdefault.jpg',
        title: '즉석으로 올린 시청자 책상 상태 구경하기',
        description:
          '관련 영상 •시청자 방 훈수하기: https://youtu.be/Uepu0fO--9E ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ▷생방송 ...',
      },
      {
        id: '4y53gppRDUo',
        imgUrl: 'https://i.ytimg.com/vi/4y53gppRDUo/maxresdefault.jpg',
        title: '최고의 돼지고기 요리 월드컵',
        description:
          '관련 영상 •중국 요리 월드컵 64강: https://youtu.be/aDZB9FewV0M ▷관련 재생목록 •침착맨의 이상형 월드컵: ...',
      },
      {
        id: 'tH3A6gbAwt4',
        imgUrl: 'https://i.ytimg.com/vi/tH3A6gbAwt4/maxresdefault.jpg',
        title: '백반 먹방과 인간 좌약',
        description:
          '관련 영상 •금태와 금태양: https://youtu.be/jEDqcpuhNac ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: https://url.kr/a4vk8m ...',
      },
      {
        id: 'zEU1JhXABUA',
        imgUrl: 'https://i.ytimg.com/vi/zEU1JhXABUA/maxresdefault.jpg',
        title: '모자를 쓰고 방송하는 이유',
        description:
          '관련 영상 •지각은 왜 하는가?: https://youtu.be/J8TonSFgDk4 ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ▷생방송 ...',
      },
      {
        id: 'eblo05Q4-N4',
        imgUrl: 'https://i.ytimg.com/vi/eblo05Q4-N4/maxresdefault.jpg',
        title: '왜 먹지를 못하는가',
        description:
          '관련 영상 •8090 국산 차 월드컵: https://youtu.be/gME5_YiCGr0 ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'gME5_YiCGr0',
        imgUrl: 'https://i.ytimg.com/vi/gME5_YiCGr0/maxresdefault.jpg',
        title: '8090 국산 차 월드컵',
        description:
          '관련 영상 •【침펄풍】 눈쌀 찌푸려지는 튜닝카는? 극혐 양카 월드컵: https://youtu.be/X-IAT_AFTKs ▷관련 재생목록 •침착맨의 ...',
      },
      {
        id: 'N7UPueuKt_4',
        imgUrl: 'https://i.ytimg.com/vi/N7UPueuKt_4/maxresdefault.jpg',
        title: '고도로 발달한 닭껍질교자는 고추와 구분할 수 없다',
        description:
          '관련 영상 •사이좋게 나눠먹는 분식: https://youtu.be/FwAf4mbaVis ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'g40UmIS3MHE',
        imgUrl: 'https://i.ytimg.com/vi/g40UmIS3MHE/maxresdefault.jpg',
        title: '주호민 새로운 작업실 알아보기',
        description:
          '관련 영상 •침투부 회사 사옥 쇼핑: https://youtu.be/n9HYZdhsm3o ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ...',
      },
    ],
    nextPageToken: 'CDIQAA',
  },
  {
    pageToken: 'CDIQAA',
    datas: [
      {
        id: 'Uqq_tDKxnEg',
        imgUrl: 'https://i.ytimg.com/vi/Uqq_tDKxnEg/maxresdefault.jpg',
        title: '이마트 롤 &amp; 마라강정',
        description:
          '관련 영상 •침착한 편식가 - 1화 "롤" 편 (完): https://www.youtube.com/watch?v=vq2EG7dIemA ▷관련 재생목록 •침착맨의 식욕저하 ...',
      },
      {
        id: 'jEDqcpuhNac',
        imgUrl: 'https://i.ytimg.com/vi/jEDqcpuhNac/maxresdefault.jpg',
        title: '금태와 금태양',
        description:
          '관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ▷생방송 원본 •2023년 2월 14일 방송분: ...',
      },
      {
        id: 'C4PqIh8wvyI',
        imgUrl: 'https://i.ytimg.com/vi/C4PqIh8wvyI/maxresdefault.jpg',
        title: '뉴진스(가 광고한) 버거',
        description:
          '관련 영상 •  BTS brought me here  : https://youtu.be/Khis3zW4btU •【침&펄】 맥도날드 먹으면서 광고촬영 후기: ...',
      },
      {
        id: '4LKF086ky_s',
        imgUrl: 'https://i.ytimg.com/vi/4LKF086ky_s/maxresdefault.jpg',
        title: '다나카와 함께하는 한국 국물요리 월드컵',
        description:
          '관련 영상 •다나카 초대석: https://youtu.be/gwbLBsvWV_Y ▷관련 재생목록 •침착맨의 이상형 월드컵: ...',
      },
      {
        id: 'gwbLBsvWV_Y',
        imgUrl: 'https://i.ytimg.com/vi/gwbLBsvWV_Y/maxresdefault.jpg',
        title: '다나카 초대석',
        description:
          '관련 영상 •다나카와 함께하는 한국 국물요리 월드컵: https://youtu.be/4LKF086ky_s ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'PTJpv8cdvZ4',
        imgUrl: 'https://i.ytimg.com/vi/PTJpv8cdvZ4/maxresdefault.jpg',
        title: '귤(Mandarin orange)을 알아보자',
        description:
          '관련 영상 •【다이어트 먹방】 귤 먹기: https://youtu.be/rwL4KGbvSZg ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ...',
      },
      {
        id: 'rcHy957I4Hs',
        imgUrl: 'https://i.ytimg.com/vi/rcHy957I4Hs/maxresdefault.jpg',
        title: '게임은 패드로 해야 한다 vs 키마로 해야 한다',
        description:
          '침착맨 채널 구독자 이벤트   내가 응원하는 팀은⁉ ⌨로캣과 함께하는 침착맨 vs 터틀비치와 함께하는 주호민 공식 구매 링크:   ...',
      },
      {
        id: '7QnVBNbTVeM',
        imgUrl: 'https://i.ytimg.com/vi/7QnVBNbTVeM/maxresdefault.jpg',
        title: '궤도와 다시 하는 &#39;지금 당장 있으면 좋을 과학 기술 월드컵&#39;',
        description:
          '관련 영상 •놀러 온 궤도의 돈고추라면: https://youtu.be/j67xuAK_qz4 ▷관련 재생목록 •침착맨의 이상형 월드컵: ...',
      },
      {
        id: 'j67xuAK_qz4',
        imgUrl: 'https://i.ytimg.com/vi/j67xuAK_qz4/maxresdefault.jpg',
        title: '놀러 온 궤도의 돈고추라면',
        description:
          '관련 영상 •궤도와 다시 하는 지금 당장 있으면 좋을 과학 기술 월드컵: https://youtu.be/7QnVBNbTVeM ▷관련 재생목록 •  ‍  불만 ...',
      },
      {
        id: 'mhZBhpagdVU',
        imgUrl: 'https://i.ytimg.com/vi/mhZBhpagdVU/maxresdefault.jpg',
        title: '롯데리아 전주 비빔라이스 버거',
        description:
          '관련 영상 •먹으면 웃음이 절로 나오는 군대리아 세트: https://youtu.be/6oSBkEU1ohQ ▷관련 재생목록 •침착맨의 식욕저하 다이어트 ...',
      },
      {
        id: '5ahN5s59M5I',
        imgUrl: 'https://i.ytimg.com/vi/5ahN5s59M5I/maxresdefault.jpg',
        title: '한 달 늦은 뉴스 속보',
        description:
          '관련 영상 •침착맨이 요즘 관심있는 것들: https://youtu.be/w2wREDRrROk ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'l1Vncs1qw_M',
        imgUrl: 'https://i.ytimg.com/vi/l1Vncs1qw_M/maxresdefault.jpg',
        title: '(잔인주의) 너굴맨의 개과천선',
        description:
          '관련 영상 •(잔인주의) 선량한 사람은 너굴맨이 처리했으니 안심하라구: https://youtu.be/8hSds3puPQY ▷관련 재생목록 •레드 데드 ...',
      },
      {
        id: '7XRufU8uafs',
        imgUrl: 'https://i.ytimg.com/vi/7XRufU8uafs/maxresdefault.jpg',
        title: '학창 시절 가장 열받는 일 월드컵',
        description:
          '관련 영상 •카더가든 & 비비 초대석: https://youtu.be/ndaymi8Mss4 ▷관련 재생목록 •침착맨의 이상형 월드컵: ...',
      },
      {
        id: 'ndaymi8Mss4',
        imgUrl: 'https://i.ytimg.com/vi/ndaymi8Mss4/maxresdefault.jpg',
        title: '카더가든 &amp; 비비 초대석',
        description:
          '관련 영상 •이름이 많은 사람: https://youtu.be/eixLlnY-TrA •가수 비비 초대석: https://youtu.be/fA5BhaxRvN0 ▷관련 재생목록 •침착맨 ...',
      },
      {
        id: 'e2tttO-8LUw',
        imgUrl: 'https://i.ytimg.com/vi/e2tttO-8LUw/maxresdefault.jpg',
        title: '과자를 가루로 만들어 밥에 뿌려 드셔보시겠습니까?',
        description:
          '관련 영상 •신개념 사업 구상 - 가루 삼겹살: https://youtu.be/gwHQLBUStO4 ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'VfD-rap67hk',
        imgUrl: 'https://i.ytimg.com/vi/VfD-rap67hk/maxresdefault.jpg',
        title: '아이돌 모르는 사람의 딥 러닝 암기법',
        description:
          '관련 영상 •딥 러닝으로 풀어보는 예능 게임: https://youtu.be/cUJmNvaVE3U ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'FwAf4mbaVis',
        imgUrl: 'https://i.ytimg.com/vi/FwAf4mbaVis/maxresdefault.jpg',
        title: '사이좋게 나눠먹는 분식',
        description:
          '관련 영상 •떡볶이로 식사가 될까?: https://youtu.be/WQokyoYgZ_s ▷관련 재생목록 •침착맨의 식욕저하 다이어트 먹방: ...',
      },
      {
        id: 'xTxEq_64uQs',
        imgUrl: 'https://i.ytimg.com/vi/xTxEq_64uQs/maxresdefault.jpg',
        title: '사진만 보고 무슨 라면인지 맞히기',
        description:
          '관련 영상 •가장 맛있는 라면을 뽑아라! 라면 월드컵: https://youtu.be/AcIZANFqEl8 ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'vxtFplAvnsM',
        imgUrl: 'https://i.ytimg.com/vi/vxtFplAvnsM/maxresdefault.jpg',
        title: '김치순두제비는 언제 먹나요?',
        description:
          '관련 영상 •돌아온 고마운 최고민수: https://youtu.be/YLxRBicbGh4 ▷관련 재생목록 •  ‍  불만 피우면 쿡방: ...',
      },
      {
        id: 'a6Kw3GQxcKg',
        imgUrl: 'https://i.ytimg.com/vi/a6Kw3GQxcKg/maxresdefault.jpg',
        title: '밀덕이 훌륭한 지휘관이 될 수 있을까?',
        description:
          "관련 영상 •임용한 박사님의 '전쟁사의 오해와 진실' 특강: https://youtu.be/rd2qDgHC1vg ▷관련 재생목록 •침착맨과 특강: ...",
      },
      {
        id: 'PhWyC9sPF0M',
        imgUrl: 'https://i.ytimg.com/vi/PhWyC9sPF0M/maxresdefault.jpg',
        title: '모든 분리수거의 신',
        description:
          '관련 영상 •최고의 인성쓰레기를 찾아라! 애니속 쓰레기 월드컵: https://youtu.be/3_YAPxrIuro ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: '8hSds3puPQY',
        imgUrl: 'https://i.ytimg.com/vi/8hSds3puPQY/maxresdefault.jpg',
        title: '(잔인주의) 선량한 사람은 너굴맨이 처리했으니 안심하라구',
        description:
          '관련 영상 •서부개척시대 브이로그: https://youtu.be/Wckcfh0Vu_E ▷관련 재생목록 •레드 데드 리뎀션 2 (Red Dead Redemption 2): ...',
      },
      {
        id: 'mdsaZz5WVHU',
        imgUrl: 'https://i.ytimg.com/vi/mdsaZz5WVHU/maxresdefault.jpg',
        title: '계속되는 남도형 성우와의 토크',
        description:
          '관련 영상 •성우 남도형 초대석: https://youtu.be/JgkdgAfTdBk ▷관련 재생목록 •침착맨의 일상재롱: https://goo.gl/OJ4Uoa ▷생방송 ...',
      },
      {
        id: 'JgkdgAfTdBk',
        imgUrl: 'https://i.ytimg.com/vi/JgkdgAfTdBk/maxresdefault.jpg',
        title: '성우 남도형 초대석',
        description:
          '관련 영상 •계속되는 남도형 성우와의 토크: https://youtu.be/mdsaZz5WVHU ▷관련 재생목록 •침착맨의 일상재롱: ...',
      },
      {
        id: 'koeM3TRigqU',
        imgUrl: 'https://i.ytimg.com/vi/koeM3TRigqU/maxresdefault.jpg',
        title: 'AI는 삼국지를 알까?',
        description:
          '관련 영상 •침vs풍 즉흥토론 - AI가 지배하는 세상, 온다 VS 안온다: https://youtu.be/QDSWCArqpYU ▷관련 재생목록 •침착맨의 일상 ...',
      },
    ],
    nextPageToken: 'CEsQAA',
  },
];

export default dummyData;
