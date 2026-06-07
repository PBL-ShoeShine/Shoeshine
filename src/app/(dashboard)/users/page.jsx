"use client";

import { useEffect, useState } from "react";
import { Info, Plus, Search } from "lucide-react";
import DeleteConfirmModal from "@/components/users/DeleteConfirmModal";
import UserFormModal from "@/components/users/UserFormModal";
import UserPagination from "@/components/users/UserPagination";
import UserTable from "@/components/users/UserTable";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/services/user.service";

const LIMIT = 4;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [formModal, setFormModal] = useState({
    open: false,
    mode: "create",
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    user: null,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getUsers({
          search: debouncedSearch,
          page,
          limit: LIMIT,
        });
        const data = response?.data || {};

        setUsers(data.users || []);
        setPagination(
          data.pagination || {
            page,
            limit: LIMIT,
            total: 0,
            totalPages: 1,
          },
        );
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Gagal memuat data pengguna.",
        );
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [debouncedSearch, page]);

  const refreshUsers = async () => {
    const response = await getUsers({
      search: debouncedSearch,
      page,
      limit: LIMIT,
    });
    const data = response?.data || {};

    setUsers(data.users || []);
    setPagination(
      data.pagination || {
        page,
        limit: LIMIT,
        total: 0,
        totalPages: 1,
      },
    );
  };

  const openCreateModal = () => {
    setFormModal({
      open: true,
      mode: "create",
      user: null,
    });
  };

  const openEditModal = (user) => {
    setFormModal({
      open: true,
      mode: "edit",
      user,
    });
  };

  const closeFormModal = () => {
    setFormModal({
      open: false,
      mode: "create",
      user: null,
    });
  };

  const handleSubmitUser = async (payload) => {
    try {
      setSubmitLoading(true);
      setError("");

      if (formModal.mode === "edit" && formModal.user?.id_user) {
        await updateUser(formModal.user.id_user, payload);
      } else {
        await createUser(payload);
      }

      closeFormModal();
      await refreshUsers();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal menyimpan data pengguna.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteModal({
      open: true,
      user,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      user: null,
    });
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user?.id_user) return;

    try {
      setDeleteLoading(true);
      setError("");

      await deleteUser(deleteModal.user.id_user);
      closeDeleteModal();
      await refreshUsers();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal menghapus pengguna.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      

       
      </div>

      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-xl border-4 border-blue-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <label className="flex h-12 w-full items-center gap-3 rounded-lg bg-slate-100 px-4 md:max-w-md">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Tambah Pembeli
          </button>
        </div>

        <UserTable
          users={users}
          loading={loading}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />

        <UserPagination
          page={pagination.page}
          total={pagination.total}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      </section>

      <div className="mt-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm font-semibold text-blue-700">
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          Perubahan pada data pengguna akan tercatat secara otomatis dalam log
          aktivitas sistem ShoeShine.
        </p>
      </div>

      <UserFormModal
        open={formModal.open}
        mode={formModal.mode}
        user={formModal.user}
        loading={submitLoading}
        onClose={closeFormModal}
        onSubmit={handleSubmitUser}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        user={deleteModal.user}
        loading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
