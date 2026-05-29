const {createClient} = require('@supabase/supabase-js')

const supabase = createClient('https://wxmpctdwapceosumbzod.supabase.co', 'sb_secret_QiwS7vWkkCajXBQ-LFCltw_G-BfB78i')

module.exports = supabase