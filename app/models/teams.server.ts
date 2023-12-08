import type { Staff, Team } from "@prisma/client";
import { prisma } from "~/db.server";
import type { StaffWithDetails } from "./auth/staff.server";

export interface TeamWithStaff extends Team {
  staff: StaffWithDetails[];
}

export const getTeam = async (id: string): Promise<TeamWithStaff | null> => {
  return prisma.team.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      staff: {
        include: {
          avatar: true,
          userDetails: true,
        },
      },
    },
  });
};

export const addTeamMemberToTeam = async (
  staffId: string,
  teamId: string
): Promise<Staff | null> => {
  return await prisma.staff.update({
    where: { id: staffId },
    data: {
      team: {
        connect: { id: parseInt(teamId) },
      },
    },
  });
};

export const removeTeamMemberFromTeam = async (
  staffId: string,
  teamId: string
): Promise<Staff> => {
  return await prisma.staff.update({
    where: { id: staffId },
    data: {
      team: {
        disconnect: { id: parseInt(teamId) },
      },
    },
  });
};

export const upsertTeam = async (teamData: any): Promise<Team> => {
  const { name, store, isActive, id } = teamData;

  if (!id) {
    return await prisma.team.create({
      data: {
        name,
        store: {
          connect: {
            id: parseInt(store),
          },
        },
        isActive,
      },
    });
  } else {
    return await prisma.team.upsert({
      where: { id: parseInt(id) },
      update: {
        name,
        store: {
          connect: {
            id: parseInt(store),
          },
        },
        isActive,
      },
      create: {
        name,
        store: {
          connect: {
            id: parseInt(store),
          },
        },
        isActive,
      },
    });
  }
};

export const searchTeams = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
): Promise<{ teams: Team[]; totalPages: number }> => {
  const name =
    formData?.name || (url && url.searchParams.get("name")?.toString()) || "";
  const storeId =
    formData?.storeId ||
    (url && url.searchParams.get("storeId")?.toString()) ||
    "";
  const pageNumber =
    (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
    (url && Number(url.searchParams.get("pageNumber"))) ||
    1;
  const perPage =
    (formData?.perPage && parseInt(formData.perPage as string)) ||
    (url && Number(url.searchParams.get("perPage"))) ||
    10;

  const skip = (pageNumber - 1) * perPage;
  let take = perPage;

  // Construct a where clause based on the search parameters provided
  const whereClause: { [key: string]: any } = {};

  if (name) {
    whereClause.name = {
      contains: name,
      mode: "insensitive",
    };
  }
  if (storeId) {
    whereClause.storeId = {
      equals: parseInt(storeId as string),
    };
  }

  // Find and count the users
  const [teams, totalTeams] = await Promise.all([
    prisma.team.findMany({
      where: whereClause,
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take,
    }),
    prisma.team.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalTeams / (Number(perPage) || 1));

  return { teams, totalPages };
};
