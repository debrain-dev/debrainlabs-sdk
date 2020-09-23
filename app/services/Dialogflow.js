/* eslint-disable max-len */
/* eslint-disable camelcase */
/* global app, Record */

const differenceInCalendarYears = require('date-fns/differenceInCalendarYears');
const differenceInCalendarDays = require('date-fns/differenceInCalendarDays');
const getMonth = require('date-fns/getMonth');
const getDate = require('date-fns/getDate');
const getYear = require('date-fns/getYear');
const parseISO = require('date-fns/parseISO');

module.exports = {

  parse(payload) {

    /* define the current intent type */
    const { intent: { displayName: intent } } = payload.queryResult;

    /* default response */
    let response = this._dfr('💻');

    /* get_dob_and_name */
    if (intent === 'get_dob_and_name') response = this.get_dob_and_name(payload);

    /* get_ocassion_type */
    if (intent === 'get_ocassion_type') response = this.get_ocassion_type(payload);

    /* get_ocassion_type */
    if (intent === 'get_ocassion_time') response = this.get_ocassion_time(payload);

    /* get_vibe */
    if (intent === 'get_vibe') response = this.get_vibe(payload);

    /* get_email */
    if (intent === 'get_email') response = this.get_email(payload);

    if (intent === 'reset') response = this.trigger_reset(payload);

    if (intent === 'fallback_3') response = this.easter_eggs_proccess(payload);

    if (intent === 'easter_eggs') response = this.easter_eggs(payload);

    if (intent === 'easter_eggs_proccess') response = this.easter_eggs_proccess(payload);

    if (intent === 'Default Welcome Intent') response = this.welcome(payload);

    if (intent === 'unstop') response = this.unstop(payload);

    if (intent === 'surprise_me') response = this.surprise_me(payload);

    if (intent === 'get_surprise_email') response = this.get_surprise_email(payload);

    if (intent === 'positive_response') response = this.positive_response(payload);

    return response;
  },

  welcome(payload) {

    let output = this._get_random_msg('welcome');
    const { source } = payload.originalDetectIntentRequest;

    if (source === 'facebook') {
      output += `

If you came here looking for our normal customer service chat, feel free to send us a question at social@jagermeister.com.`;
    } else {
      output += `

Btw, we may send you recommendations in the future, and you can text STOP at any time to end this chat.`;
    }

    return this._dfr(output);
  },

  unstop(payload) {

    let output = `Welcome back!

${this._get_random_msg('welcome')}`;

    const { source } = payload.originalDetectIntentRequest;

    if (source === 'facebook') {
      output += `

If you came here looking for our normal customer service chat, feel free to send us a question at social@jagermeister.com.`;
    } else {
      output += `

Btw, we may send you recommendations in the future, and you can text STOP at any time to end this chat.`;
    }

    return this._dfr(output);
  },

  get_dob_and_name(payload) {
    /* parameters are '[given-name'] and date */
    const { parameters: { date: dob } } = payload.queryResult;
    let { parameters: { 'given-name': name } } = payload.queryResult;

    // fallback values
    if (name.length === 0) name = ['NOT_SET'];

    const _dob = parseISO(dob);
    const _current_year = getYear(Date.now());

    let _current_month = getMonth(Date.now()) + 1;
    let _current_day = getDate(Date.now());

    _current_day = _current_day < 10 ? `0${_current_day}` : `${_current_day}`;
    _current_month = _current_month < 10 ? `0${_current_month}` : `${_current_month}`;

    const _dob_y = getYear(_dob);
    let _dob_d = getDate(_dob);
    let _dob_m = getMonth(_dob) + 1;

    _dob_d = _dob_d < 10 ? `0${_dob_d}` : `${_dob_d}`;
    _dob_m = _dob_m < 10 ? `0${_dob_m}` : `${_dob_m}`;

    const next_bday = parseISO(`${_current_year}-${_dob_m}-${_dob_d}`);
    const user_age = differenceInCalendarYears(Date.now(), _dob);
    const days_to_bday = differenceInCalendarDays(next_bday, Date.now());

    if (user_age < 21) return this._dfr(this._get_random_msg('dob_errors_to_young')); /* menor de 21 */
    if (_dob_y < 1903) return this._dfr(this._get_random_msg('dob_errors_to_old')); /* muy viejo */
    if (_dob_m === _current_month && _dob_d === _current_day) return this.interactive_message(this._get_date_ee('bday'), 'celebration_type'); /* birthday */
    if (_dob_m === '11' && _dob_d === '14') return this.interactive_message(this._get_date_ee('jmday'), 'celebration_type'); /* jagermeister day */
    if (days_to_bday > 0 && days_to_bday <= 6) return this.interactive_message(this._get_date_ee('neartobday'), 'celebration_type'); /* near to bday */
    if (this._get_name_ee(name) !== '') return this.interactive_message(this._get_name_ee(name), 'celebration_type'); /* name easter egg */

    const output = this._get_random_msg('dob_success');
    return this.interactive_message(output, 'celebration_type');
  },

  _get_random_msg(node) {
    const messages = app.config.df[node];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  _get_random_element(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  _dfr(text) {
    const response = { fulfillmentMessages: [{ text: { text: [text] } }] };
    response.fulfillmentMessages.push({
      text: {
        text: [text]
      },
      platform: 'PLATFORM_UNSPECIFIED'
    });
    return response;
  },

  _get_date_ee(c) {
    let output = '';

    if (c === 'jmday') {
      output += `Perfekt. BTW, your birthday falls on Philadelphia’s official Jägermeister day. No joke, it’s a thing.
${this._get_random_msg('dob_ee_complement')}
      `;
    }

    if (c === 'bday') {
      output += `Alles Gute zum Geburtstag! That means Happy Birthday, just in case you haven’t brushed up on your German lately. A little gift from us: use code BDAYPARTY for 20% off at our merch store. DO spend it all in one place.
${this._get_random_msg('dob_ee_complement')}
      `;
    }

    if (c === 'neartobday') {
      output += `We see you’re having a birthday soon, so allow us to be the first to say Alles Gute zum Geburtstag! A little gift from us: use code BDAYPARTY for 20% off at our merch store. DO spend it all in one place.
${this._get_random_msg('dob_ee_complement')}
      `;
    }

    return output;
  },

  _get_name_ee(_name) {
    const name = _name[0].toLowerCase();

    const trump = ['donald', 'trump'];
    const beyonce = ['beyonce', 'bey', 'beyoncé'];
    const mom = [' mom', 'mom ', 'mom'];
    const hubertus = ['hubertus'];
    const curt = ['curt'];

    if (trump.some((v) => name.includes(v))) return `Don’t take this as a political statement, but don’t you have more important things to do right now? ${this._get_random_msg('dob_ee_complement')}`;
    if (beyonce.some((v) => name.includes(v))) return 'No, No, No. Hold up. As much as we would love to hear from Queen Bey, we have a feeling you’re just a “Beautiful Liar.” Try again.';
    if (mom.some((v) => name.includes(v))) return `Well, aren’t you clever? Want to try again, Mom? ${this._get_random_msg('dob_ee_complement')}`;
    if (hubertus.some((v) => name.includes(v))) return `Just like our stag 🦌Gracing our bottle with its hunter-y presence since 1935. This bodes well. ${this._get_random_msg('dob_ee_complement')}`;
    if (curt.some((v) => name.includes(v))) return `No way. The Meister behind Jägermeister is a Curt too. This calls for a bonus: use code CURT20 to get 20% off our merch store. ${this._get_random_msg('dob_ee_complement')}`;

    return '';
  },

  get_ocassion_type(payload) {
    const { parameters: { occasion_type: ot } } = payload.queryResult;
    const { ocassion_type } = app.config.df;
    const result = ocassion_type.filter((o) => o.ocassion === ot);
    const [r] = result;
    const { text } = r;

    const output = text;
    return result.length > 0 ? this.interactive_message(output, 'time') : this._dfr('We’re smart, but not smart enough for that one. Keep it to our keywords and you can be sure of a fine time.');
  },

  get_ocassion_time(payload) {
    console.log('get_ocassion_time', payload);
    const { parameters: { ocassion_time: ot, ocassion_type: type } } = payload.queryResult;
    console.log(ot, type);
    const { ocassion_time } = app.config.df;
    const result = ocassion_time.filter((o) => o.time === ot);
    const [r] = result;
    const { text } = r;

    const params = {
      occasion: type === 'birthday' ? 'celabration' : type,
      time: ot
    };

    const { occasion, time } = params;
    const { data } = app.config.combos;
    const oc = data.find((o) => o.occasion === occasion);
    const va = oc.variants.find((v) => v.name === time);
    const { drink, food, image } = va.options;
    let output = text.replace('_DRINK_NAME_', drink);
    output = output.replace('_FOOD_NAME_', food);

    return result.length > 0 ? this.interactive_message(output, 'vibe', image) : this._dfr('We’re smart, but not smart enough for that one. Keep it to our keywords and you can be sure of a fine time.');
  },

  surprise_me() {
    const time = this._get_random_element(['day', 'night', 'both']);
    const occasion = 'surprise';
    const { data } = app.config.combos;
    const oc = data.find((o) => o.occasion === occasion);
    const va = oc.variants.find((v) => v.name === time);
    const { image } = va.options;
    const output = 'The adventurous spirit is strong with you. Share your email to get the full rundown of ideas for a great hang, including this ridiculously delicious recipe from Chef Chris Santos. You know, the guy from that cooking show that rhymes with "Dropped." 🤤';
    return output.length > 0 ? this.photo_message(output, image) : this._dfr('We’re smart, but not smart enough for that one. Keep it to our keywords and you can be sure of a fine time.');
  },

  get_vibe(payload) {
    const { parameters: { vibe: v } } = payload.queryResult;
    const { vibe_sms: msg } = app.config.df;

    const result = msg.filter((o) => o.vibe === v);
    const [r] = result;
    const { text } = r;

    const output = text;
    return result.length > 0 ? this._dfr(output) : this._dfr('We’re smart, but not smart enough for that one. Keep it to our keywords and you can be sure of a fine time.');
  },

  get_email(payload) {
    const { session } = payload;
    let phone = session.split('+');
    if (phone.length > 1) phone = `+${phone[1]}`;
    if (phone.length === 1) phone = 'NOT_SET';
    const { source } = payload.originalDetectIntentRequest;

    const data = this._conversation_status(payload);

    const {
      dob,
      type: occasionType,
      time: occasionTime,
      vibe,
      email
    } = data;
    let { name } = data;

    if (name.length === 0) name = 'NOT_SET';

    let bottype = 'sms';
    if (source === 'facebook') bottype = source;

    const output = this._get_random_msg('closing');

    Record.create({
      name,
      dob,
      occasionType,
      occasionTime,
      vibe,
      email,
      bottype,
      phone
    });

    return this._dfr(output);
  },

  get_surprise_email(payload) {
    const { session } = payload;
    let phone = session.split('+');
    if (phone.length > 1) phone = `+${phone[1]}`;
    if (phone.length === 1) phone = 'NOT_SET';

    const { source } = payload.originalDetectIntentRequest;
    const data = this._conversation_status(payload);

    const {
      dob,
      email
    } = data;
    let { name } = data;

    if (name.length === 0) name = 'NOT_SET';

    let bottype = 'sms';
    if (source === 'facebook') bottype = source;

    const output = this._get_random_msg('closing');

    Record.create({
      name,
      dob,
      occasionType: 'surprise',
      occasionTime: this._get_random_element(['day', 'night', 'both']),
      vibe: this._get_random_element(['nice_easy', 'doing_it_up']),
      email,
      bottype,
      phone
    });

    return this._dfr(output);
  },

  ocassion_time_text(text, params) {
    const { occasion, time } = params;
    const { data } = app.config.combos;
    const oc = data.find((o) => o.occasion === occasion);
    const va = oc.variants.find((v) => v.name === time);
    const { drink, food, image } = va.options;
    let output = text.replace('_DRINK_NAME_', drink);
    output = output.replace('_FOOD_NAME_', food);
    output = output.replace('_PHOTO_URL_', image);

    return output;
  },

  easter_eggs(payload) {
    let output = '';

    const { queryResult: { queryText: _userinput } } = payload;
    const userinput = _userinput.toLowerCase();

    const dictionary_thanks = ['thnx', 'thx', 'thank u', 'danke', 'thanks', 'thank you'];
    if (dictionary_thanks.some((v) => userinput.includes(v))) output = this._get_random_msg('ee_thanks');

    const dictionary_are_you = ['are you', 'r u'];
    if (dictionary_are_you.some((v) => userinput.includes(v))) output = 'We’re a highly skilled German engineered chatbot, here to serve. Obviously.';

    const dictionary_56 = ['56'];
    if (dictionary_56.some((v) => userinput.includes(v))) output = 'That’s exactly right! You just unlocked a 28% discount on our merch store with code JAGER56. Get yourself something nice. https://shop.jagermeister.com/';

    const dictionary_hunter = ['hunter', 'master', 'hunt'];
    if (dictionary_hunter.some((v) => userinput.includes(v))) output = 'Real ones know—that’s our name in English. Get 20% off our merch store with code GENIUS20 as a reward for your deep and impressive knowledge. https://shop.jagermeister.com/';

    const dictionary_ikon = ['ikon'];
    if (dictionary_ikon.some((v) => userinput.includes(v))) output = 'And isn’t it… iconic? You unlocked 15% off any item from our IKON Collection, clothing created for people like you who follow their own rules. Just use code: IKON15. https://shop.jagermeister.com/collections/the-ikon-collection';

    const dictionary_franklin = ['franklin'];
    if (dictionary_franklin.some((v) => userinput.includes(v))) output = 'Cozy up like a Meister. Take 30% off the Jägermeister Graffiti Jacket from our Rich Franklin collection with code FRANKLIN30. https://shop.jagermeister.com/collections/the-rich-franklin-collection/products/graffiti-jacket-mens';

    const dictionary_german = ['101', 'german 101', 'german101'];
    if (dictionary_german.some((v) => userinput.includes(v))) output = this._get_random_msg('ee_german');

    const dictionary_trivia = ['trivia'];
    if (dictionary_trivia.some((v) => userinput.includes(v))) output = this._get_random_msg('ee_trivia');

    const dictionary_bday = ['bday', 'birthday'];
    if (dictionary_bday.some((v) => userinput.includes(v))) output = 'alles Gute zum Geburtstag! 🎉 A little gift from us: use code BDAYPARTY for 20% off at our merch store. DO spend it all in one place.';

    // check for required data in the context. If all the slots are filled, show a plain message,
    // if not, ask to continue
    const data = this._conversation_status(payload);
    let gaps = 0;

    if (data.dob === '') gaps += 1;
    if (data.type === '') gaps += 1;
    if (data.time === '' && data.type !== 'surprise_me') gaps += 1;
    if (data.vibe === '' && data.type !== 'surprise_me') gaps += 1;
    if (data.email === '' && data.type !== 'surprise_me') gaps += 1;

    if (gaps > 0) return this.interactive_message(output, 'easter_egg_folowup');

    return this._dfr(output);
  },

  _conversation_status(payload) {
    const data = {
      name: '',
      dob: '',
      type: '',
      time: '',
      vibe: '',
      email: ''
    };

    const { outputContexts: contexts } = payload.queryResult;
    console.log(contexts);

    // search for the name
    const name_contexts = contexts.filter((c) => c.name.includes('c_name_dob'));
    if (name_contexts.length > 0) {
      const [nc] = name_contexts;
      data.name = nc.parameters['given-name'];
    }

    // search for the dob
    const dob_contexts = contexts.filter((c) => c.name.includes('c_name_dob'));
    if (dob_contexts.length > 0) {
      const [dobc] = dob_contexts;
      data.dob = dobc.parameters.date;
    }

    // search for the type
    const type_contexts = contexts.filter((c) => c.name.includes('c_ocassion_type'));
    if (type_contexts.length > 0) {
      const [typec] = type_contexts;
      data.type = typec.parameters.occasion_type;
    }

    // search for the time
    const time_contexts = contexts.filter((c) => c.name.includes('c_ocassion_time'));
    if (time_contexts.length > 0) {
      const [timec] = time_contexts;
      data.time = timec.parameters.ocassion_time;
    }

    // search for the vibe
    const vibe_contexts = contexts.filter((c) => c.name.includes('c_vibe'));
    if (vibe_contexts.length > 0) {
      const [vibec] = vibe_contexts;
      data.vibe = vibec.parameters.vibe;
    }

    // search for the email
    const email_context = contexts.filter((c) => c.name.includes('c_email'));
    if (email_context.length > 0) {
      console.log(email_context);
      const [ec] = email_context;
      data.email = ec.parameters.email;
    }

    return data;
  },

  easter_eggs_proccess(payload) {
    let next = 'e_get_dob_name';
    let parameters = {};

    // dependiendo del estado de la aplicación, deberíamos mapear hacia un evento:
    // [e_welcome] pregunta el nombre y la edad
    // [e_get_dob_name] pregunta el tipo
    // [e_get_ocassion_type] pregunta el tiempo
    // [e_get_ocassion_time] pregunta el vibe
    // [e_get_vibe] pregunta el email normal
    // [e_surprise_me] pregunta el email sorpresa

    const data = this._conversation_status(payload);

    if (data.email === '' && data.type === 'surprise_me') {
      next = 'e_surprise_me';
      parameters = { email: data.email };
    }

    if (data.vibe === '' && data.type === 'surprise_me') {
      next = 'e_surprise_me';
      parameters = { email: data.email };
    }

    if (data.time === '' && data.type === 'surprise_me') {
      next = 'e_surprise_me';
      parameters = { email: data.email };
    }

    if (data.email === '' && data.type !== 'surprise_me') {
      next = 'e_get_vibe';
      parameters = { vibe: data.vibe };
    }

    if (data.vibe === '' && data.type !== 'surprise_me') {
      next = 'e_get_ocassion_time';
      parameters = { ocassion_time: data.time, ocassion_type: data.type };
    }

    if (data.time === '' && data.type !== 'surprise_me') {
      next = 'e_get_ocassion_type';
      parameters = { occasion_type: data.type };
    }

    if (data.type === '') {
      next = 'e_get_dob_name';
      parameters = { 'given-name': data.name, date: data.dob };
    }

    if (data.dob === '') {
      next = 'e_welcome';
      parameters = {};
    }

    console.log('ee_proccess', { next, data, parameters });

    return ({
      followupEventInput: {
        name: next,
        languageCode: 'en-US',
        parameters
      }
    });
  },

  positive_response(payload) {

    // check for required data in the context. If all the slots are filled, show a plain message,
    // if not, ask to continue
    const data = this._conversation_status(payload);
    let gaps = 0;

    if (data.dob === '') gaps += 1;
    if (data.type === '') gaps += 1;
    if (data.time === '' && data.type !== 'surprise_me') gaps += 1;
    if (data.vibe === '' && data.type !== 'surprise_me') gaps += 1;
    if (data.email === '' && data.type !== 'surprise_me') gaps += 1;

    if (gaps === 0) return this._dfr(this._get_random_msg('positive_response'));

    let next = 'e_get_dob_name';
    let parameters = {};

    // dependiendo del estado de la aplicación, deberíamos mapear hacia un evento:
    // [e_welcome] pregunta el nombre y la edad
    // [e_get_dob_name] pregunta el tipo
    // [e_get_ocassion_type] pregunta el tiempo
    // [e_get_ocassion_time] pregunta el vibe
    // [e_get_vibe] pregunta el email normal
    // [e_surprise_me] pregunta el email sorpresa

    if (data.email === '' && data.type === 'surprise_me') {
      next = 'e_surprise_me';
      parameters = { email: data.email };
    }

    if (data.vibe === '' && data.type === 'surprise_me') {
      next = 'e_surprise_me';
      parameters = { email: data.email };
    }

    if (data.time === '' && data.type === 'surprise_me') {
      next = 'e_surprise_me';
      parameters = { email: data.email };
    }

    if (data.email === '' && data.type !== 'surprise_me') {
      next = 'e_get_vibe';
      parameters = { vibe: data.vibe };
    }

    if (data.vibe === '' && data.type !== 'surprise_me') {
      next = 'e_get_ocassion_time';
      parameters = { ocassion_time: data.time, ocassion_type: data.type };
    }

    if (data.time === '' && data.type !== 'surprise_me') {
      next = 'e_get_ocassion_type';
      parameters = { occasion_type: data.type };
    }

    if (data.type === '') {
      next = 'e_get_dob_name';
      parameters = { 'given-name': data.name, date: data.dob };
    }

    if (data.dob === '') {
      next = 'e_welcome';
      parameters = {};
    }

    console.log('positive_response', { next, data, parameters });

    return ({
      followupEventInput: {
        name: next,
        languageCode: 'en-US',
        parameters
      }
    });
  },

  trigger_reset(payload) {
    console.log(payload);
    return ({
      followupEventInput: {
        name: 'e_welcome',
        parameters: {
          'parameter-name-1': 'parameter-value-1',
          'parameter-name-2': 'parameter-value-2'
        },
        languageCode: 'en-US'
      },

      outputContexts: []
    });
  },

  fallback() {
    return (
      {
        followupEventInput: {
          name: 'reset',
          parameters: {
            'parameter-name-1': 'parameter-value-1',
            'parameter-name-2': 'parameter-value-2'
          },
          languageCode: 'en-US'
        }
      }
    );
  },

  interactive_message(_text, _buttons, _img = 'none') {
    let buttons = app.config.df.buttons.filter((b) => b.type === _buttons);
    [buttons] = buttons;
    const { text: buttons_text, facebook: quickReplies } = buttons;

    const raw_text = `${_text} Text back:

${buttons_text}`;

    let sms = '';
    if (_img !== 'none') {
      sms = `${_img}-+-${raw_text}`;
    } else {
      sms = raw_text;
    }

    const response = {
      fulfillmentMessages: [
        {
          text: { text: [sms] }
        }
      ]
    };

    if (_img !== 'none') {
      response.fulfillmentMessages.push({
        image: {
          imageUri: _img
        },
        platform: 'FACEBOOK'
      });
    }

    response.fulfillmentMessages.push({
      quickReplies: {
        title: _text,
        quickReplies
      },
      platform: 'FACEBOOK'
    });

    response.fulfillmentMessages.push({
      text: {
        text: [sms]
      },
      platform: 'PLATFORM_UNSPECIFIED'
    });

    return response;
  },

  photo_message(_text, _img = 'none') {

    const raw_text = `${_text}`;

    let sms = '';
    if (_img !== 'none') {
      sms = `${_img}-+-${raw_text}`;
    } else {
      sms = raw_text;
    }

    const response = {
      fulfillmentMessages: [
        {
          text: { text: [sms] }
        }
      ]
    };

    if (_img !== 'none') {
      response.fulfillmentMessages.push({
        image: {
          imageUri: _img
        },
        platform: 'FACEBOOK'
      });
    }

    response.fulfillmentMessages.push({
      quickReplies: {
        title: _text,
        quickReplies: []
      },
      platform: 'FACEBOOK'
    });

    response.fulfillmentMessages.push({
      text: {
        text: [sms]
      },
      platform: 'PLATFORM_UNSPECIFIED'
    });

    return response;
  },

};
