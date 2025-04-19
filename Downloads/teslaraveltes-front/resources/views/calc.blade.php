<x-layout>
    <x-slot:title>{{ $title }}</x-slot>
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <h1 class="text-2xl font-bold mb-4 text-center">Form Parameter Orbit</h1>

    <form method="GET" action="">
    @csrf
        <div class="mb-4">
            <label for="jenis_orbit" class="block font-medium">Jenis Orbit:</label>
            <select name="jenis_orbit" id="jenis_orbit" onchange="updateKetinggian(); showFields()" required class="border p-2 w-full rounded">
                <option value="">-- Pilih Orbit --</option>
                <option value="LEO" {{ request('jenis_orbit') == 'LEO' ? 'selected' : '' }}>LEO</option>
                <option value="MEO" {{ request('jenis_orbit') == 'MEO' ? 'selected' : '' }}>MEO</option>
                <option value="GEO" {{ request('jenis_orbit') == 'GEO' ? 'selected' : '' }}>GEO</option>
            </select>
        </div>

        <div class="mb-4">
            <label for="ketinggian" class="block font-medium">Ketinggian (km):</label>
            <input type="text" name="ketinggian" id="ketinggian" class="border p-2 w-full rounded">
        </div>

        <div id="apogee_field" class="mb-4">
            <label class="block font-medium">Apogee (km):</label>
            <input type="number" name="apogee" id="apogee" class="border p-2 w-full rounded" min="0">
        </div>

        <div id="perigee_field" class="mb-4">
            <label class="block font-medium">Perigee (km):</label>
            <input type="number" name="perigee" id="perigee" class="border p-2 w-full rounded mt-2" min="0">
        </div>

        <div id="inklinasi_field" class="mb-4">
            <label for="inklinasi" class="block font-medium">Sudut Inklinasi (°):</label>
            @if(request('jenis_orbit') == 'LEO')
                <p>Orbit yang dipilih adalah <strong>LEO</strong></p>
                <input type="number" name="ketinggian">
            @elseif(request('jenis_orbit') == 'MEO')
                <p>Orbit yang dipilih adalah <strong>MEO</strong></p>
                <input type="number" name="ketinggian">
            @elseif(request('jenis_orbit') == 'GEO')
                <p>Orbit yang dipilih adalah <strong>GEO</strong></p>
                <input type="number" name="ketinggian" value="0" placeholder="0" readonly>
            @else
                <p><em>Belum memilih jenis orbit</em></p>
            @endif

            <input type="number" name="inklinasi" id="inklinasi" step="0.01" class="border p-2 w-full rounded" min="0">
        </div>

        <div id="elevasi_field" class="mb-4">
            <label for="elevasi" class="block font-medium">Sudut Elevasi (°):</label>
            <input type="number" name="elevasi" id="elevasi" step="0.01" class="border p-2 w-full rounded" min="0">
        </div>

        <div id="slant_range_field" class="mb-4">
            <label for="slant_range" class="block font-medium">Slant Range (km):</label>
            <input type="number" name="slant_range" id="slant_range" class="border p-2 w-full rounded" min="0">
        </div>

        <div id="azimuth_field" class="mb-4">
            <label for="azimuth" class="block font-medium">Sudut Azimuth (°):</label>
            <input type="number" name="azimuth" id="azimuth" class="border p-2 w-full rounded" min="0">
        </div>

        <button type="submit" class="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600 w-full">Simpan</button>
    </form>
</div>
</x-layout>