import { GameHandler } from './components/handlers/gameHandler';

const values = getQueryParameters(window.location.href);

function getQueryParameters(url:string) {
  const searchParams = new URLSearchParams(url);
  const email = searchParams.get('email');
  const jwtToken = searchParams.get('jwtToken');
  console.log('Email:', email);
  console.log('JWT Token:', jwtToken);
  return { email, jwtToken };
}

const game = new GameHandler(values.email, values.jwtToken);

const main = async () => {
  game.render();

  game.init();
};

main();

export { game };
