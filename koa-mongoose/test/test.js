const request = require('request-promise');
require('..'); // run server

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('User API', () => {

  describe('POST /user', () => {

    it('sends a message to all subscribers', function* () {

    });

    context('when request body isn\'t valid' , () => {

      it('returns 400', function* () {


        response.statusCode.should.eql(400);
      });

      it('message is ignored', function* () {



      });


    });

  });

});
