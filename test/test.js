var should = require('should'),
	BaseMaster = require('../basemaster.js').BaseMaster;

describe('BaseMaster', function(){
	describe('#initiate', function(){
		it('Should work (All Defaults)', function() {
			var bm = new BaseMaster();
		});

		it('Should work (Base 10)', function() {
			var bm = new BaseMaster({
				'start_base':10
			});
		});

		it('Should work (Base 64)', function() {
			var bm = new BaseMaster({
				'end_base':64
			});
		});

		it('Should Throw (Above 64 - 173)', function() {
			(function(){
				var bm = new BaseMaster({
					'end_base':173
				});
			}).should.throwError();
		});
	});

	describe('#encode', function() {
		it('Should work (Decimal to Hex)', function() {
			var bm = new BaseMaster({
				'start_base':10,
				'end_base':16
			});

			bm.encode(1473).should.eql('5C1');
		});

		it('Should work (Hex to Decimal)', function() {
			var bm = new BaseMaster({
				'start_base':16,
				'end_base':10
			});

			bm.encode('CA').should.eql(202);
		});

		it('Should work (Binary to Base 36)', function() {
			var bm = new BaseMaster();

			bm.encode('1101001010101001010010101010010101', {
				'start_base':2,
				'end_base':36
			}).should.eql('6HSY4D1');
		});

		it('Should work (Decimal to Base 64)', function() {
			var bm = new BaseMaster();

			bm.encode(759374403, {
				'start_base':10,
				'end_base':64
			}).should.eql('tQyJD');
		});

		it('Should Throw (Above 64 - 123)', function() {
			(function() {
				var bm = new BaseMaster();
				bm.encode('10012010101011200', {
					'start_base':3,
					'end_base':123
				});
			}).should.throwError();
		});
	});

	describe('#decode', function() {
		it('Should work (Decimal to Hex)', function() {
			var bm = new BaseMaster({
				'start_base':10,
				'end_base':16
			});
			var test_number = Math.floor(Math.random()*10000),
				test_conversion = bm.encode(test_number);

			bm.decode(test_conversion).should.eql(test_number);
		});

		it('Should work (Base 64 to Hex)', function() {
			var bm = new BaseMaster({
				'start_base':16,
				'end_base':64
			});

			bm.decode('dsnfdjgDg').should.eql('1DB277DD8E00E0');
		});

		it('Should work (Base 2 to Base 36)', function() {
			var bm = new BaseMaster();

			bm.decode('10010101101010110010010101010101011101010010101010101', {
				'start_base':36,
				'end_base':2
			}).should.eql('1FUN01D74UT');
		});

		it('Should throw (Base 20 to Base 165)', function() {
			(function(){
				var bm = new BaseMaster();

				bm.decode('AABCDDEFBBD', {
					'start_base':165,
					'end_base':20
				});
			}).should.throwError();
		});
	});
});
// ToDo: Write tests for extremely high numbers.