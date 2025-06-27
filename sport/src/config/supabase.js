// Debug: Check environment
console.log('🔍 Environment check:');
console.log('- Window object:', typeof window !== 'undefined');
console.log('- Supabase global:', typeof window?.supabase !== 'undefined');
console.log('- import.meta.env:', import.meta.env);

// Check if Supabase is loaded
if (typeof window === 'undefined' || !window.supabase) {
    console.error('❌ Supabase library not loaded!');
    throw new Error('Supabase library not loaded. Make sure to include the Supabase script before this module.');
}

console.log('✅ Supabase library loaded successfully');

// Get environment variables
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Debug environment variables (hide sensitive data)
console.log('🔍 Environment variables:');
console.log('- SUPABASE_URL:', SUPABASE_URL ? 'Set ✅' : 'Missing ❌');
console.log('- SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY?.substring(0, 10) + '...' || 'Missing ❌');

// Validate environment variables
if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('⚠️ Please update your Supabase credentials in .env file');
    console.warn('⚠️ Current URL:', SUPABASE_URL);
    console.warn('⚠️ Current Key prefix:', SUPABASE_ANON_KEY?.substring(0, 10) + '...');
}

// Create Supabase client
console.log('🔍 Creating Supabase client...');
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('✅ Supabase client created:', supabase);

// Test connection
export const testConnection = async () => {
    console.log('🔍 Testing Supabase connection...');
    try {
        const { error } = await supabase.from('activities').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('❌ Supabase query error:', error);
            throw error;
        }
        console.log('✅ Supabase connection successful');
        console.log('📊 Activities table accessible');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error);
        console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        return false;
    }
};

// Export for debugging
export { SUPABASE_URL, SUPABASE_ANON_KEY };
