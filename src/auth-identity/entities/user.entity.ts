import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Column({ nullable: true, unique: true })
  facebookId?: string;

  @Column({ nullable: true, unique: true })
  twitterId?: string;

  @Column({ type: 'varchar', length: 16 })
  role: 'buyer' | 'seller';

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ nullable: true })
  dob?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationCode?: string;

  @Column({ nullable: true, type: 'timestamp' })
  emailVerificationExpires?: Date;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  loginOtpCode?: string;

  @Column({ nullable: true, type: 'timestamp' })
  loginOtpExpires?: Date;

  @Column({ nullable: true })
  passwordResetCode?: string;

  @Column({ nullable: true, type: 'timestamp' })
  passwordResetExpires?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
