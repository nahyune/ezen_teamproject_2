import { StatusBarArea } from "../components/TopBars";
import { ChevronLeft } from "../components/Icons";
import SectionHeader from "../components/SectionHeader";
import mag1 from "../assets/img/mag1.webp";
import mag2 from "../assets/img/mag2.webp";
import mag3 from "../assets/img/mag3.webp";
import shoeNike from "../assets/img/shoe-nike-pegasus41.webp";
import shoeAdidas from "../assets/img/shoe-adidas-adizero-sl2.webp";
import shoeHoka from "../assets/img/shoe-hoka-clifton9.webp";

type Props = {
  onBack: () => void;
};

const sections = [
  {
    number: "01",
    title: "쿠션이냐, 반응성이냐",
    body: "러닝화는 크게 푹신한 착지감의 쿠션형과 스피드에 유리한 반응형으로 나뉘어요. 이제 막 달리기를 시작했다면 무릎 부담을 줄여주는 쿠션형부터 시작하는 걸 추천해요.",
  },
  {
    number: "02",
    title: "내 발에 맞는 사이즈 찾기",
    body: "러닝 중에는 발이 붓기 때문에 평소 신는 사이즈보다 5~10mm 큰 사이즈를 추천해요. 발볼이 넓다면 와이드 옵션이 있는 모델을 골라보세요.",
  },
  {
    number: "03",
    title: "런린이 추천 체크리스트",
    body: "쿠션 40mm 이하의 데일리 트레이너, 드롭 8~10mm, 무게 250g 안팎이면 충분해요. 발이 붓는 저녁 시간대에 착용해 보는 걸 추천!",
  },
];

const tags = ["#러닝화", "#입문 가이드", "#러닝 기어"];

const relatedArticles = [
  {
    image: mag2,
    title: ["러닝 시작", "전 2분, 후 3분"],
    subtitle: ["무릎을 지키는", "가장 짧은 루틴"],
  },
  {
    image: mag3,
    title: ["서울을", "달리는 크루들"],
    subtitle: ["첫 번째 크루,", "와우산30을 만나다"],
  },
];

const products = [
  { image: shoeNike, brand: "NIKE", name: "에어 줌 페가수스 41", price: "149,000원" },
  { image: shoeAdidas, brand: "ADIDAS", name: "아디제로 SL 2", price: "129,000원" },
  { image: shoeHoka, brand: "HOKA", name: "클리프턴 9", price: "179,000원" },
];

const sectionTitleClass = "text-[24px] font-semibold leading-[1.3] tracking-[-0.48px] text-white";
const bodyTextClass = "text-[16px] font-normal leading-[1.3] tracking-[-0.48px] text-white/50";

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="18" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11L16 6M8 13L16 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden>
      <path d="M18.3144 8.21641C18.4993 8.20138 18.7963 8.19656 18.9843 8.19544C21.5773 8.17967 24.0692 9.20077 25.9056 11.0317C27.7611 12.8569 28.8046 15.3516 28.8015 17.9543C28.7966 20.3393 27.9223 22.6406 26.3424 24.4273C25.6125 25.244 24.9833 25.7111 24.5998 26.7819C24.3327 27.5277 24.1649 28.3546 24.1266 29.1462C24.1082 29.5281 24.1481 29.9363 24.0748 30.3119C24.0493 30.4424 23.9857 30.6171 23.882 30.7067C23.6177 30.9353 20.364 30.8345 19.7979 30.8333L16.4277 30.8379C15.8373 30.8395 15.2137 30.88 14.6269 30.8273C14.4737 30.8135 14.2609 30.7901 14.1382 30.6886C13.855 30.4544 13.8954 28.9198 13.8437 28.4983C13.7906 28.0612 13.7011 27.6294 13.5761 27.2073C13.0918 25.5843 12.6393 25.5229 11.6448 24.3761C10.2654 22.7865 9.43712 20.7934 9.28385 18.6943C9.0871 16.0853 9.94689 13.5067 11.6701 11.5378C13.3593 9.5967 15.7479 8.4027 18.3144 8.21641ZM15.1387 29.5909L19.7608 29.5933C20.6955 29.5925 21.9888 29.5509 22.8939 29.5984C22.9442 28.2353 23.1708 26.855 23.7913 25.6239C24.3955 24.4253 25.3925 23.8111 26.1344 22.6783C28.315 19.3608 27.9494 14.9835 25.2488 12.0737C23.7307 10.4427 21.6304 9.47665 19.4041 9.38551C19.0325 9.373 18.6605 9.37894 18.2895 9.40328C15.9691 9.6233 13.9198 10.6359 12.4222 12.4425C10.9517 14.2099 10.2524 16.4937 10.4813 18.7814C10.6612 20.6003 11.4231 22.3126 12.6536 23.664C13.256 24.3208 13.71 24.6405 14.1533 25.4693C14.8832 26.8337 15.0383 28.0949 15.1387 29.5909Z" fill="#D4FF3F" />
      <path d="M18.9261 10.6973C19.9657 10.638 21.2193 10.9382 22.1574 11.367C23.9852 12.195 25.4101 13.7139 26.1198 15.5908C26.359 16.2365 26.4965 16.8735 26.5632 17.5571C26.6168 18.1064 26.7239 18.6657 26.087 18.8852C25.3663 18.8194 25.3655 18.2853 25.3228 17.6641C25.1115 14.5849 22.424 12.016 19.3425 11.9192C19.156 11.9133 18.7934 11.8554 18.6265 11.7503C18.1843 11.3622 18.4181 10.8268 18.9261 10.6973Z" fill="#D4FF3F" />
      <path d="M14.8666 31.5165C15.3474 31.478 15.9856 31.4937 16.4781 31.4934L19.0856 31.4929L21.5025 31.4934C22.0915 31.4936 23.1706 31.4136 23.6621 31.714C24.011 31.9232 24.2584 32.2666 24.3463 32.6637C24.4293 33.0358 24.3608 33.4257 24.156 33.7473C23.8805 34.1731 23.5211 34.3313 23.0538 34.4312C22.6732 34.4823 22.0224 34.4674 21.6227 34.4678L19.2843 34.4691L16.6168 34.4707C15.9656 34.4709 14.8227 34.5592 14.2829 34.2116C13.9459 33.991 13.7119 33.6441 13.6335 33.249C13.5628 32.8653 13.6465 32.4692 13.8663 32.1469C14.1181 31.7763 14.4371 31.5955 14.8666 31.5165ZM22.5347 33.2084C22.7919 33.2109 23.0436 33.2337 23.1439 32.9304C23.1159 32.7028 22.8519 32.685 22.6577 32.6855C20.2825 32.6925 17.8673 32.6364 15.4948 32.6749C15.2242 32.6752 14.9288 32.6348 14.8237 32.9514C14.8459 33.0493 14.8371 33.0607 14.9366 33.1292C15.0004 33.1731 15.1564 33.2055 15.234 33.2063C16.0298 33.2144 16.8404 33.2109 17.6351 33.2108L22.5347 33.2084Z" fill="#D4FF3F" />
      <path d="M8.36788 3.89995C8.62293 3.88841 8.83316 3.9623 8.98141 4.18477C9.73684 5.31844 10.5224 6.48316 11.1896 7.6694C11.4232 8.08491 11.1287 8.39262 10.7377 8.56028C10.3284 8.5434 10.1863 8.34657 9.98021 8.01718C9.30051 6.92502 8.53888 5.8612 7.92286 4.73334C7.70971 4.34311 8.02892 4.03721 8.36788 3.89995Z" fill="#D4FF3F" />
      <path d="M35.2838 11.4711C35.869 11.4062 36.1885 11.8779 35.9795 12.2836C35.7905 12.6504 34.4134 13.2887 34.0002 13.5107C33.359 13.8552 32.6258 14.2987 31.9938 14.5633C31.2202 14.6686 31.0306 13.7979 31.5313 13.4816C32.4282 12.9148 33.4357 12.4483 34.3635 11.9249C34.6299 11.7746 35.0036 11.5664 35.2838 11.4711Z" fill="#D4FF3F" />
      <path d="M2.38981 11.4706C2.4772 11.4635 2.57083 11.458 2.65789 11.4689C2.99963 11.5116 6.43288 13.3766 6.6283 13.6564C6.71506 13.7805 6.75681 13.9527 6.72679 14.1018C6.68393 14.3148 6.53341 14.4501 6.36119 14.5666C6.29996 14.5725 6.10929 14.5874 6.05188 14.5621C4.80549 14.015 3.6227 13.2709 2.41882 12.632C1.81756 12.3129 1.80121 11.7954 2.38981 11.4706Z" fill="#D4FF3F" />
      <path d="M29.7405 4.08319C31.1294 4.23194 29.8242 5.73016 29.4528 6.27693C29.0891 6.81242 28.1111 8.48446 27.6204 8.70848C27.1013 8.62165 26.7587 8.27646 27.059 7.76472C27.5774 6.89424 28.1679 6.05991 28.7265 5.21338C28.9725 4.84066 29.3114 4.22023 29.7405 4.08319Z" fill="#D4FF3F" />
      <path d="M15.8793 38C15.4133 37.7514 14.9867 37.4942 14.8255 36.9449C14.7144 36.5597 14.7651 36.146 14.9659 35.7991C15.0951 35.5727 15.4962 35.1484 15.7667 35.1229C17.7394 34.9364 19.7626 35.0638 21.7514 35.0591C22.8932 35.0564 23.5882 36.2675 23.0316 37.2526C22.7758 37.7057 22.4808 37.7525 22.1021 38H15.8793ZM21.7917 36.7477C21.9623 36.6504 22.0599 36.5397 21.9598 36.3396C21.7598 36.1849 20.9235 36.2148 20.6478 36.2176C19.1714 36.2328 17.686 36.1947 16.2107 36.2302C16.0046 36.3167 15.9454 36.4006 16.0303 36.6245C16.2386 36.8318 17.5201 36.7593 17.8632 36.7591L21.064 36.7547C21.2884 36.7542 21.5707 36.7611 21.7917 36.7477Z" fill="#D4FF3F" />
      <path d="M18.7936 0H19.1851C19.4585 0.20586 19.5769 0.350575 19.5939 0.718823C19.6309 1.51618 19.5927 2.32137 19.5948 3.12061C19.5961 3.62044 19.6217 4.12463 19.598 4.62275C19.5686 5.01555 19.3464 5.32842 18.9192 5.26556C18.5263 5.20778 18.4238 4.92946 18.4032 4.57009C18.3634 3.8757 18.3923 3.1763 18.3811 2.48085C18.3797 1.83487 18.3637 1.18016 18.4146 0.536991C18.4364 0.269849 18.5917 0.145989 18.7936 0Z" fill="#D4FF3F" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 9.5L8.5 3.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 3.5H8.5V8.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MagazineDetailPage({ onBack }: Props) {
  return (
    <div className="phone min-h-screen bg-black text-[#f6f6ed]">
      <StatusBarArea />

      <header className="subheader justify-between">
        <button className="grid h-6 w-6 shrink-0 place-items-center text-white" type="button" onClick={onBack} aria-label="뒤로가기">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-center text-[24px] font-semibold leading-[1.3] tracking-[-0.48px] text-white">매거진</h1>
        <button className="grid h-6 w-6 shrink-0 place-items-center text-white" type="button" aria-label="공유하기">
          <ShareIcon />
        </button>
      </header>

      <main className="flex flex-col gap-12 pb-10">
        <section className="relative h-[400px] overflow-hidden">
          <img className="h-full w-full object-cover" src={mag1} alt="러닝화와 러닝 기어가 놓인 사진" />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(102,102,102,0)_50%,#000_100%)]"
            aria-hidden
          />
          <div className="absolute left-[18px] right-[18px] top-[207px] flex flex-col gap-[14px]">
            <span className="inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full bg-[var(--primary-lime)] px-[14px] py-[8px] text-[14px] font-semibold leading-[1.3] tracking-[-0.42px] text-black">
              러닝 기어
            </span>
            <div className="flex flex-col gap-[6px]">
              <h2 className="flex flex-col text-[28px] font-bold leading-[1.3] tracking-[-0.56px] text-white">
                <span>런린이</span>
                <span>첫 러닝화 가이드</span>
              </h2>
              <p className="text-[16px] font-normal leading-[1.3] tracking-[-0.48px] text-white/70">
                종류가 너무 많아 고르기 어려운 당신에게
              </p>
            </div>
            <p className="text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-white/50">
              위런 매거진 · 2026. 7. 2
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-10 px-[18px]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-2">
                <span className="[font-family:var(--font-display)] text-[24px] leading-[1.4] text-[var(--primary-lime)]">
                  {sections[0].number}
                </span>
                <h3 className={sectionTitleClass}>{sections[0].title}</h3>
              </div>
              <p className={bodyTextClass}>{sections[0].body}</p>
            </div>
            <div className="flex items-center gap-[14px] rounded-[20px] bg-[#1c1c1f] p-5">
              <span className="shrink-0">
                <LightbulbIcon />
              </span>
              <p className="flex flex-col text-[20px] font-semibold leading-[1.3] tracking-[-0.6px] text-[#f6f6ed]">
                <span>첫 러닝화의 기준,</span>
                <span>10km를 신고도 발이 편안한가.</span>
              </p>
            </div>
          </div>

          {sections.slice(1).map((s) => (
            <div className="flex flex-col gap-[10px]" key={s.number}>
              <div className="flex items-center gap-2">
                <span className="[font-family:var(--font-display)] text-[24px] leading-[1.4] text-[var(--primary-lime)]">
                  {s.number}
                </span>
                <h3 className={sectionTitleClass}>{s.title}</h3>
              </div>
              <p className={bodyTextClass}>{s.body}</p>
            </div>
          ))}

          <div className="flex gap-2">
            {tags.map((tag) => (
              <span
                className="whitespace-nowrap rounded-full border border-[#404538] bg-[#1f211f] px-[14px] py-[8px] text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[#f6f6ed]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[15px]">
          <div className="px-[18px]">
            <SectionHeader title="함께 보면 좋은 매거진" />
          </div>
          <div className="flex gap-3 overflow-x-auto px-[18px] no-scrollbar">
            {relatedArticles.map((a) => (
              <article
                className="relative h-[263px] w-[207px] shrink-0 overflow-hidden rounded-[20px] bg-[var(--bg-elevated)]"
                key={a.title.join("")}
              >
                <img className="absolute inset-0 h-full w-full object-cover" src={a.image} alt="" />
                <div
                  className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_32%,rgba(0,0,0,0.41)_51%,rgba(0,0,0,0.59)_64%,rgba(0,0,0,0.77)_100%)]"
                  aria-hidden
                />
                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-[10px] text-white">
                  <h4 className="flex flex-col text-[20px] font-medium leading-[1.3] tracking-[-0.6px]">
                    {a.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h4>
                  <p className="flex flex-col text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-white/70">
                    {a.subtitle.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[15px]">
          <div className="px-[18px]">
            <SectionHeader title="추천 러닝화" />
          </div>
          <p className="px-[18px] text-[16px] font-normal leading-[1.3] tracking-[-0.48px] text-white/70">
            이 글에서 소개한 입문용 러닝화, 바로 만나보세요
          </p>
          <div className="flex gap-3 overflow-x-auto px-[18px] no-scrollbar">
            {products.map((p) => (
              <article
                className="flex w-[180px] shrink-0 flex-col overflow-hidden rounded-[20px] bg-[#1c1c1f]"
                key={p.name}
              >
                <div className="relative h-[110px] w-full overflow-hidden bg-[#f5f4f2]">
                  <img
                    className="absolute left-1/2 top-1/2 h-[220%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
                    src={p.image}
                    alt={`${p.brand} ${p.name}`}
                  />
                </div>
                <div className="flex flex-col gap-[3px] px-[14px] py-3">
                  <p className="text-[12px] font-medium leading-[1.3] tracking-[-0.36px] text-white/50">{p.brand}</p>
                  <p className="text-[16px] font-semibold leading-[1.3] tracking-[-0.48px] text-[#f5f4f2]">{p.name}</p>
                  <p className="text-[16px] font-semibold leading-[1.3] tracking-[-0.48px] text-white">{p.price}</p>
                </div>
                <div className="px-[14px] pb-[14px]">
                  <button
                    className="flex h-[34px] w-full items-center justify-center gap-1 rounded-full bg-[var(--primary-lime)] text-[16px] font-semibold leading-[1.3] tracking-[-0.48px] text-black"
                    type="button"
                  >
                    바로 구매
                    <ArrowUpRightIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
