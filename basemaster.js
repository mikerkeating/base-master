var BaseMaster = function(cust_conf) {
	if(!cust_conf)
		cust_conf = {};

	var base_strings = {
			'36':'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			'64':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
		},
		settings = { // Default to Base 36 -> Base 64
			'start_base':36,
			'start_base_pool':base_strings['36'],
			'end_base':64,
			'end_base_pool':base_strings['64'],
			'debug':false
		},
		BaseMasterException = function(message) {
			this.message = 'BaseMaster: '+message;
			this.name = 'BaseMasterException';
		},
		check_pool = function(cfg, prefix) {
			var base_str = prefix+'_base',
				pool_str = prefix+'_base_pool';

			if(cfg[base_str] !== cfg[pool_str].length) {
				if(settings['debug'])
					console.log('BaseMaster: Character pool size is incorrect for base. Attempting to sub in a new pool.');
				if(cfg[base_str] <= 36)
					cfg[pool_str] = base_strings['36'].substr(0, cfg[base_str]);
				else if(cfg[base_str] <= 64)
					cfg[pool_str] = base_strings['64'].substr(0, cfg[base_str]);
				else
					throw new BaseMasterException('Unable to automatically discern base pool for bases above 64. Please pass in the "'+prefix+'_base_pool" config value to define an appropriate base.');
			}
		},
		check_config = function(cfg) {
			check_pool(cfg, 'start');
			check_pool(cfg, 'end');
		},
		sub_config = function(cfg) {
			if(!cfg)
				cfg = {};

			for(var key in settings) {
				if(typeof cfg[key] === 'undefined')
					cfg[key] = settings[key];
			}

			return cfg;
		};



	for(var key in cust_conf) // swap in user-defined options
		settings[key] = cust_conf[key];

	check_config(settings);

	// Convert a String (str) with a Base of base and a character pool of pool to a Base 10 string. (Decimal Number)
	var to_base_10 = function(str, pool, base) {
		// Convert input to a string.
		str = String(str);
		var converted_str = 0;

		// Go through the characters of the string, convert to base 10.
		for (var char_idx = 0; char_idx < str.length; char_idx++)
			converted_str = (converted_str*base)+pool.indexOf(str[char_idx]);

		return converted_str;
	};

	var encode = function(str, t_conf) {
		// Allow passing custom config to this method.
		t_conf = sub_config(t_conf);

		check_config(t_conf);

		// Make sure what we're processing is a string.
		str = String(str);
		var encoded_str = '',
			str_num = 0,
			this_char_idx;

		for(var char_idx = 0; char_idx < str.length; char_idx++) {
			if(t_conf['start_base_pool'].indexOf(str[char_idx]) === -1)
				return false;
		}

		// Convert to Base 10
		str_num = to_base_10(str, t_conf['start_base_pool'], t_conf['start_base']);

		// Convert from Base 10 to the destination base (Just makes it easier, as simple math is possible.)
		while (true) {
			this_char_idx = str_num % t_conf['end_base'];
			encoded_str = t_conf['end_base_pool'][this_char_idx] + encoded_str;
			str_num = Math.floor(str_num / t_conf['end_base']);

			if(str_num === 0)
				break;
		}

		return encoded_str;
	};

	var decode = function(str, t_conf) {
		t_conf = sub_config(t_conf);

		check_config(t_conf);

		// Just run encode again, but switch start & end bases.
		return encode(str, {
			'start_base_pool':t_conf['end_base_pool'],
			'start_base':t_conf['end_base'],
			'end_base_pool':t_conf['start_base_pool'],
			'end_base':t_conf['start_base']
		});
	};

	this.encode = encode;
	this.decode = decode;
};

if(typeof module !== 'undefined' && module.exports)
	module.exports.BaseMaster = BaseMaster;