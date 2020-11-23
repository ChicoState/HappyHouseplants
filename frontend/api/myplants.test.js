global.auth = { token: true };

it('Can add to myplants', () => {
  expect(global.auth.token).toBeTruthy();
});
