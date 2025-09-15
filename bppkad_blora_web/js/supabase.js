// Supabase Configuration
const SUPABASE_URL = 'https://scernchnrrfmdxtqrxrd.supabase.co'; // Ganti dengan URL Supabase Anda
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZXJuY2hucnJmbWR4dHFyeHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3OTYxNDYsImV4cCI6MjA3MjM3MjE0Nn0.UWUcsuPl5JJ7Batu6PBt4gMyTiosTqTQJ6Ile0eFV_U'; // Ganti dengan Anon Key Supabase Anda

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table name
const TABLE_NAME = 'apbd_data';

/**
 * Create the APBD data table if it doesn't exist
 * Table structure:
 * - id: bigint (primary key, auto-increment)
 * - kategori: text (Pendapatan, Pembelanjaan, Pembiayaan)
 * - subkategori: text
 * - isi_subkategori: text
 * - tahun: integer
 * - anggaran: numeric
 * - realisasi: numeric
 * - created_at: timestamptz
 */
async function createTableIfNotExists() {
    try {
        // Check if table exists by attempting to select from it
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .limit(1);
        
        if (error && error.code === '42P01') {
            // Table doesn't exist, create it
            console.log('Creating APBD data table...');
            // Note: You need to create this table manually in Supabase dashboard
            // SQL to create table:
            /*
            CREATE TABLE apbd_data (
                id BIGSERIAL PRIMARY KEY,
                kategori TEXT NOT NULL,
                subkategori TEXT NOT NULL,
                isi_subkategori TEXT,
                tahun INTEGER NOT NULL,
                anggaran NUMERIC DEFAULT 0,
                realisasi NUMERIC DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            */
            throw new Error('Please create the apbd_data table in your Supabase dashboard first');
        }
    } catch (error) {
        console.error('Error checking/creating table:', error);
    }
}

/**
 * Add new APBD data
 */
async function addApbdData(data) {
    try {
        const { data: result, error } = await supabase
            .from(TABLE_NAME)
            .insert([{
                kategori: data.kategori,
                subkategori: data.subkategori,
                isi_subkategori: data.isi_subkategori || null,
                tahun: parseInt(data.tahun),
                anggaran: parseFloat(data.anggaran) || 0,
                realisasi: parseFloat(data.realisasi) || 0
            }])
            .select();

        if (error) throw error;
        return result[0];
    } catch (error) {
        console.error('Error adding APBD data:', error);
        throw error;
    }
}

/**
 * Get all APBD data
 */
async function getAllData() {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all data:', error);
        return [];
    }
}

/**
 * Get data by category
 */
async function getDataByCategory(kategori) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('kategori', kategori)
            .order('tahun', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching data by category:', error);
        return [];
    }
}

/**
 * Get data by category and subcategory
 */
async function getDataBySubcategory(kategori, subkategori) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('kategori', kategori)
            .eq('subkategori', subkategori)
            .order('tahun', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching data by subcategory:', error);
        return [];
    }
}

/**
 * Delete APBD data by ID
 */
async function deleteApbdData(id) {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting APBD data:', error);
        throw error;
    }
}

/**
 * Update APBD data
 */
async function updateApbdData(id, data) {
    try {
        const { data: result, error } = await supabase
            .from(TABLE_NAME)
            .update({
                kategori: data.kategori,
                subkategori: data.subkategori,
                isi_subkategori: data.isi_subkategori || null,
                tahun: parseInt(data.tahun),
                anggaran: parseFloat(data.anggaran) || 0,
                realisasi: parseFloat(data.realisasi) || 0
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        return result[0];
    } catch (error) {
        console.error('Error updating APBD data:', error);
        throw error;
    }
}

/**
 * Get summary data for dashboard
 */
async function getSummaryData() {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('kategori, tahun, anggaran, realisasi');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching summary data:', error);
        return [];
    }
}

/**
 * Get unique subcategories by category
 */
async function getSubcategoriesByCategory(kategori) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('subkategori')
            .eq('kategori', kategori)
            .order('subkategori');

        if (error) throw error;
        
        // Return unique subcategories
        const uniqueSubcategories = [...new Set(data.map(item => item.subkategori))];
        return uniqueSubcategories;
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return [];
    }
}

// Initialize table on load
document.addEventListener('DOMContentLoaded', function() {
    createTableIfNotExists();
});

// Export functions for global use (optional)
window.supabaseAPI = {
    addApbdData,
    getAllData,
    getDataByCategory,
    getDataBySubcategory,
    deleteApbdData,
    updateApbdData,
    getSummaryData,
    getSubcategoriesByCategory
};