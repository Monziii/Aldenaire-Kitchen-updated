import { loadStripe } from '@stripe/stripe-js';

// مفتاح Stripe العام - تم تحديثه
const stripePromise = loadStripe('pk_test_51RyjxGIcEhNo3vF4WDHllG9rLKmgouIZWF8YHS9voaUmyHDIck5IPNYRAVpTLoUVOjhKIkdJIGz7HQVm5XoDdhKq00oQ25jqWE');

export default stripePromise; 