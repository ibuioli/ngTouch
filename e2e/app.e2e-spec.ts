import { NgTouchPage } from './app.po';

describe('ng-touch App', function() {
  let page: NgTouchPage;

  beforeEach(() => {
    page = new NgTouchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
