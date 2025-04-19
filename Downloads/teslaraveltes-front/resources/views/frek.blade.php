<x-layout>
    <x-slot:title>{{ $title }}</x-slot>
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <h1 class="text-2xl font-bold mb-4 text-center">Form Parameter Orbit</h1>

    <form method="GET" action="">
    @csrf
        <div class="mb-4">
            <label for="jenis_frekuensi" class="block font-medium">Jenis Orbit:</label>
            <select name="jenis_frekuensi" id="jenis_frekuensi" onchange="updateKetinggian(); showFields()" required class="border p-2 w-full rounded">
                <option value="">-- Pilih Frekuensi --</option>
                <option value="Uplink" >Uplink</option>
                <option value="Downlink" >Downlink</option>
            </select>
        </div>

        <div id="nilai_field" class="mb-4">
            <label class="block font-medium"> Nilai Frekuensi:</label>
            <input type="number" name="nilai_field" id="nilai_field" class="border p-2 w-full rounded" min="0">
        </div>

        <div class="mb-4">
            <label for="jenis_Satuan" class="block font-medium">Jenis Orbit:</label>
            <select name="jenis_Satuan" id="jenis_Satuan" onchange="updateKetinggian(); showFields()" required class="border p-2 w-full rounded">
                <option value="">-- Pilih Satuan --</option>
                <option value="MHz" >MHz</option>
                <option value="GHz" >GHz</option>
            </select>
        </div>

        <button type="submit" class="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600 w-full">Simpan</button>
    </form>
</div>
</x-layout>