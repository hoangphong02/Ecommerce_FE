import styled, { css } from "styled-components";

const wideScreenStyles = css`
  @media screen and (max-width: 340px) {
    .container {
      margin-inline: 1rem;
    }
    .home__title {
      font-size: 1.5rem;
    }
    .home__tree-1 {
      left: -4rem;
    }
    .home__tree-2 {
      right: -4rem;
    }
    .items__container {
      grid-template-columns: 180px;
    }
    .party__img {
      width: 200px;
    }
    .footer__content {
      gap: 2.5rem;
    }
  }

  /* For medium devices */
  @media screen and (min-width: 576px) {
    .home__container,
    .about__container,
    .party__container {
      grid-template-columns: 0.6fr;
      justify-content: center;
    }
    .home__tree-1,
    .home__tree-2 {
      width: 200px;
    }
    .items__container {
      grid-template-columns: repeat(2, 200px);
    }
    .footer__content {
      grid-template-columns: repeat(3, max-content);
    }
  }
  @media screen and (min-width: 767px) {
    .section {
      padding-block: 7rem 1.5rem;
    }
    .section__title {
      margin-bottom: 4rem;
    }
    .nav {
      height: calc(var(--header-height) + 1.5rem);
    }
    .nav__toggle,
    .nav__close,
    .nav__img {
      display: none;
    }
    .nav__list {
      flex-direction: row;
      column-gap: 4rem;
    }
    .category__container {
      grid-template-columns: repeat(2, 228px);
      column-gap: 4rem;
    }
    .footer__content {
      grid-template-columns: repeat(4, max-content);
    }
  }
  @media screen and (min-width: 1024px) {
    .shape__small,
    .shape__big {
      filter: blur(132px);
      opacity: 0.5;
    }
    .shape__small {
      width: 350px;
      height: 350px;
    }
    .shape__big {
      width: 450px;
      height: 450px;
    }
    .home__title-img-1,
    .home__title-img-2 {
      width: 60px;
    }
    .home__title-img-2 {
      bottom: 5.75rem;
    }
    .home__description {
      padding: 0 7.5rem;
    }
    .home__tree-1,
    .home__tree-2 {
      width: 300px;
      top: 14rem;
    }
    .home__img {
      width: 500px;
    }
    .category__container {
      grid-template-columns: repeat(3, 254px);
    }
    .category__card {
      padding: 6rem 2.5rem 2rem;
    }
    .category__img {
      width: 150px;
    }
    .category__star {
      right: 1rem;
    }
    .category .shape__small {
      top: 10rem;
      left: -12rem;
    }
    .about__img {
      order: -1;
      width: 500px;
    }
    .about__container {
      padding-top: 2rem;
      grid-template-columns: max-content 0.9fr;
      column-gap: 7rem;
      align-items: center;
    }
    .about .shape__big {
      bottom: -12rem;
    }
    .about__data,
    .party__data {
      text-align: initial;
    }
    .about__container .section__title,
    .party__container .section__title {
      text-align: initial;
      margin-bottom: 1.5rem;
    }
    .about__description,
    .party__description {
      margin-bottom: 2.5rem;
    }
    .items__container {
      grid-template-columns: repeat(3, 200px);
      gap: 6rem 3.5rem;
    }
    .items__card {
      padding: 6rem 1rem 1.5rem;
    }
    .items__img {
      width: 130px;
    }
    .items__name {
      font-size: var(--h3-font-size);
    }
    .items__button i {
      font-size: 1.5rem;
    }
    .items .shape__big {
      bottom: -12rem;
    }
    .party__container {
      padding-top: 5rem;
      grid-template-columns: 0.7fr max-content;
      column-gap: 8rem;
      align-items: center;
    }
    .party__img {
      width: 400px;
    }
    .party__star-1,
    .party__star-2 {
      width: 100px;
    }
    .party__star-1 {
      top: -5rem;
      left: -5rem;
    }
    .party__star-2 {
      right: -3rem;
      bottom: 3rem;
    }
  }
  @media screen and (min-width: 1072px) {
    .container {
      margin-inline: auto;
    }
  }
  @media screen and (min-width: 1248px) {
    .home__tree-1,
    .home__tree-2 {
      width: 450px;
    }
    .home__img {
      width: 600px;
      margin-top: 3rem;
    }
    .footer__tree-2 {
      left: 10%;
    }
  }

  /* For 2K resolution (2048 * 1152) */
  @media screen and (min-width: 2048px) {
    /* 	body{
		zoom: 1.6;
	} */
    .home__container {
      position: relative;
      max-width: 1400px;
      overflow: hidden;
    }
    .home__tree-1,
    .home__tree-2 {
      top: 5rem;
    }
    .main {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-position: fixed;
      z-index: 999; /* Số này có thể được điều chỉnh tùy thuộc vào cấu trúc z-index của trang */
    }
  }
`;

export const WrapperMain = styled.main`
  overflow: hidden;
  background-color: hsl(22, 8%, 6%);
  margin-top: 0;
  & .container {
    max-width: 1024px;
    margin-inline: 1.5rem;
  }
  & .grid {
    display: grid;
    gap: 1.5rem;
  }
  ${wideScreenStyles}
`;

export const Wrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-areas:
    "nav  main"
    "nav  main";
  grid-template-rows: 50px 1fr 30px;
  grid-template-columns: 300px 1fr;
  background: rgb(16 13 35);
  box-shadow: 1px 1px 2px #ccc;
  > nav {
    grid-area: nav;
  }

  > main {
    grid-area: main;
    overflow: auto;
  }
`;
